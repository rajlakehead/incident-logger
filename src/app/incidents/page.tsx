"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useAuth } from "@/lib/useAuth";
import { auth } from "@/lib/firebase";

interface Incident {
  id: string;
  type: string;
  description: string;
  summary?: string;
  createdAt: string;
}

export default function IncidentsPage() {
  const { user, loading } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [type, setType] = useState("fall");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingIncidents, setLoadingIncidents] = useState(false);
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

   const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };



  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/";
    }
  }, [loading, user]);

  useEffect(() => {
    if (user) fetchIncidents();
  }, [user]);

  const fetchIncidents = async () => {
    if (!user) return;
    setLoadingIncidents(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/incidents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setIncidents(data);
    } catch (err) {
      console.error(err);
      alert("Could not load incidents");
    } finally {
      setLoadingIncidents(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, description }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setType("fall");
      setDescription("");
      fetchIncidents();
    } catch (err) {
      console.error(err);
      alert("Failed to create incident");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSummarize = async (id: string) => {
    if (!user) return;
    setSummarizingId(id);

    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/incidents/${id}/summarize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to summarize");

      fetchIncidents();
    } catch (err) {
      console.error(err);
      alert("Failed to summarize incident");
    } finally {
      setSummarizingId(null);
    }
  };

  if (loading || !user) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📝 Incident Log</h1>
        <button
          onClick={() => signOut(auth)}
          className="text-white bg-green-600 font-medium border  px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* Incident Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-10 space-y-6 border">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Incident Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="fall">Fall</option>
            <option value="behaviour">Behaviour</option>
            <option value="medication issue">Medication Issue</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 text-black rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Describe what happened..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Log Incident"}
        </button>
      </form>

      {/* Incident List */}
      {loadingIncidents ? (
        <p className="text-center text-black">Loading incidents...</p>
      ) : incidents.length === 0 ? (
        <p className="text-center text-black">No incidents found.</p>
      ) : (
        <ul className="space-y-6">
           {incidents.map((incident) => {
        const isExpanded = expandedId === incident.id;

        return (
          <li key={incident.id} className="bg-white border rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize font-medium">
                {incident.type}
              </span>
              <button
                onClick={() => handleSummarize(incident.id)}
                disabled={summarizingId === incident.id}
                className="text-sm text-blue-600 hover:underline disabled:opacity-40"
              >
                {summarizingId === incident.id ? "Summarizing..." : "Summarize"}
              </button>
            </div>

            <p className={`text-gray-800 whitespace-pre-wrap mb-2 ${isExpanded ? '' : 'line-clamp-2'}`}>
              {incident.description}
            </p>

            {incident.description.length > 100 && (
              <button
                onClick={() => toggleExpand(incident.id)}
                className="text-sm text-blue-600 hover:underline"
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            )}

            {incident.summary ? (
              <div className="bg-gray-50 border-t pt-3 mt-3 text-gray-700 text-sm whitespace-pre-wrap">
                <strong className="block mb-1">Summary:</strong>
                {incident.summary}
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm mt-3">No summary yet.</p>
            )}
          </li>
        );
      })}
        </ul>
      )}
    </div>
  );
}
