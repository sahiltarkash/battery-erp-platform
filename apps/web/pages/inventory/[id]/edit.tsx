import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type Battery = {
  id: string;
  sku: string;
  brand: string;
  category: string;
  voltage: string;
  capacityAh: number;
  warrantyMonths: number;
  purchasePrice: string;
  sellingPrice: string;
  stockQuantity: number;
  lowStockThreshold: number;
};

export default function InventoryEditPage() {
  const router = useRouter();
  const { id } = router.query;
  const [battery, setBattery] = useState<Battery | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof id !== 'string') return;
    axios
      .get<Battery>(`${apiBase}/api/inventory/${id}`, { withCredentials: true })
      .then((response) => setBattery(response.data))
      .catch(() => window.alert('Failed to load battery details'));
  }, [id]);

  const handleChange = (field: keyof Battery, value: string | number) => {
    setBattery((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!battery || typeof id !== 'string') return;

    setSaving(true);
    try {
      await axios.put(`${apiBase}/api/inventory/${id}`, {
        sku: battery.sku,
        brand: battery.brand,
        category: battery.category,
        voltage: battery.voltage,
        capacityAh: battery.capacityAh,
        warrantyMonths: battery.warrantyMonths,
        purchasePrice: Number(battery.purchasePrice),
        sellingPrice: Number(battery.sellingPrice),
        stockQuantity: battery.stockQuantity,
        lowStockThreshold: battery.lowStockThreshold,
      }, { withCredentials: true });
      router.push('/inventory');
    } catch (error) {
      window.alert('Failed to update battery.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!battery || typeof id !== 'string' || !window.confirm('Delete this battery?')) return;
    await axios.delete(`${apiBase}/api/inventory/${id}`, { withCredentials: true });
    router.push('/inventory');
  };

  if (!battery) {
    return (
      <main style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
        <p>Loading battery details…</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', maxWidth: '720px' }}>
      <h1>Edit Battery</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <input
          value={battery.sku}
          onChange={(event) => handleChange('sku', event.target.value)}
          placeholder="SKU"
          required
        />
        <input
          value={battery.brand}
          onChange={(event) => handleChange('brand', event.target.value)}
          placeholder="Brand"
          required
        />
        <input
          value={battery.category}
          onChange={(event) => handleChange('category', event.target.value)}
          placeholder="Category"
          required
        />
        <input
          value={battery.voltage}
          onChange={(event) => handleChange('voltage', event.target.value)}
          placeholder="Voltage"
          required
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <label>
            Capacity (Ah)
            <input
              type="number"
              value={battery.capacityAh}
              min={0}
              onChange={(event) => handleChange('capacityAh', Number(event.target.value))}
              required
            />
          </label>
          <label>
            Warranty (months)
            <input
              type="number"
              value={battery.warrantyMonths}
              min={0}
              onChange={(event) => handleChange('warrantyMonths', Number(event.target.value))}
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
              value={Number(battery.purchasePrice)}
              min={0}
              onChange={(event) => handleChange('purchasePrice', Number(event.target.value))}
              required
            />
          </label>
          <label>
            Selling price
            <input
              type="number"
              step="0.01"
              value={Number(battery.sellingPrice)}
              min={0}
              onChange={(event) => handleChange('sellingPrice', Number(event.target.value))}
              required
            />
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <label>
            Stock quantity
            <input
              type="number"
              value={battery.stockQuantity}
              min={0}
              onChange={(event) => handleChange('stockQuantity', Number(event.target.value))}
              required
            />
          </label>
          <label>
            Low stock threshold
            <input
              type="number"
              value={battery.lowStockThreshold}
              min={0}
              onChange={(event) => handleChange('lowStockThreshold', Number(event.target.value))}
              required
            />
          </label>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button type="button" onClick={handleDelete} style={{ background: '#c00', color: '#fff' }}>
            Delete
          </button>
          <Link href="/inventory">
            <button type="button">Back</button>
          </Link>
        </div>
      </form>
    </main>
  );
}
