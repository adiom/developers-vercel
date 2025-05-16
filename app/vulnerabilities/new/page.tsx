"use client";

import { createVulnerability } from "@/lib/actions";
import { useState } from "react";

export default function NewVulnerabilityPage() {
  const [form, setForm] = useState({
    assessment_id: "",
    title: "",
    description: "",
    severity: "medium",
    status: "open",
    remediation: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const res = await createVulnerability({
        ...form,
        assessment_id: Number(form.assessment_id),
        severity: form.severity,
        status: form.status,
      });
      if (res.success) setSuccess(true);
      else setError(res.error || "Ошибка");
    } catch (err) {
      setError("Ошибка при создании");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h1 className="text-xl mb-4">Создать уязвимость</h1>
      <input
        required
        placeholder="ID оценки (assessment_id)"
        value={form.assessment_id}
        onChange={e => setForm({ ...form, assessment_id: e.target.value })}
        className="input mb-2"
      />
      <input
        required
        placeholder="Заголовок"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        className="input mb-2"
      />
      <textarea
        placeholder="Описание"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        className="input mb-2"
      />
      <select
        value={form.severity}
        onChange={e => setForm({ ...form, severity: e.target.value })}
        className="input mb-2"
      >
        <option value="low">Низкая</option>
        <option value="medium">Средняя</option>
        <option value="high">Высокая</option>
        <option value="critical">Критическая</option>
      </select>
      <input
        placeholder="Статус"
        value={form.status}
        onChange={e => setForm({ ...form, status: e.target.value })}
        className="input mb-2"
      />
      <textarea
        placeholder="Рекомендации"
        value={form.remediation}
        onChange={e => setForm({ ...form, remediation: e.target.value })}
        className="input mb-2"
      />
      <button type="submit" className="btn btn-primary">Создать</button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-500 mt-2">Уязвимость создана!</div>}
    </form>
  );
} 