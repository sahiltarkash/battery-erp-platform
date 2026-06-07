import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function InventoryCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    sku: '',
    brand: '',
    category: '',
    voltage: '',
    capacityAh: 0,
    warrantyMonths: 0,
    purchasePrice: 0,
    sellingPrice: 0,
    stockQuantity: 0,
    lowStockThreshold: 5,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await axios.post(`${apiBase}/api/inventory`, form, { withCredentials: true });
      router.push('/inventory');
    } catch (error) {
      window.alert('Failed to create battery. Check the values and try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <main style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', maxWidth: '720px' }}>
      <h1>Add New Battery</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <input
          value={form.sku}
          onChange={(event) => updateField('sku', event.target.value)}
          placeholder="SKU"
          required
        />
        <input
          value={form.brand}
          onChange={(event) => updateField('brand', event.target.value)}
          placeholder="Brand"
          required
        />
        <input
          value={form.category}
          onChange={(event) => updateField('category', event.target.value)}
          placeholder="Category"
          required
        />
        <input
          value={form.voltage}
          onChange={(event) => updateField('voltage', event.target.value)}
          placeholder="Voltage"
          required
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <label>
            Capacity (Ah)
            <input
              type="number"
              value={form.capacityAh}
              min={0}
              onChange={(event) => updateField('capacityAh', Number(event.target.value))}
              required
            />
          </label>
          <label>
            Warranty (months)
            <input
              type="number"
              value={form.warrantyMonths}
              min={0}
              onChange={(event) => updateField('warrantyMonths', Number(event.target.value))}
              required
            />
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <label>
            Purchase price
            <input
              type="number"
              step="0.01"
              value={form.purchasePrice}
              min={0}
              onChange={(event) => updateField('purchasePrice', Number(event.target.value))}
              required
            />
          </label>
          <label>
            Selling price
            <input
              type="number"
              step="0.01"
              value={form.sellingPrice}
              min={0}
              onChange={(event) => updateField('sellingPrice', Number(event.target.value))}
              required
            />
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <label>
            Stock quantity
            <input
              type="number"
              value={form.stockQuantity}
              min={0}
              onChange={(event) => updateField('stockQuantity', Number(event.target.value))}
              required
            />
          </label>
          <label>
            Low stock threshold
            <input
              type="number"
              value={form.lowStockThreshold}
              min={0}
              onChange={(event) => updateField('lowStockThreshold', Number(event.target.value))}
            />
          </label>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Create Battery'}
          </button>
          <Link href="/inventory">
            <button type="button">Cancel</button>
          </Link>
        </div>
      </form>
    </main>
  );
}
