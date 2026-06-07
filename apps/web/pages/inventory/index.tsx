import axios from 'axios';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';

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

type Valuation = {
  totalQuantity: number;
  totalValue: number;
};

export default function InventoryListPage() {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [valuation, setValuation] = useState<Valuation>({ totalQuantity: 0, totalValue: 0 });
  const [transferSource, setTransferSource] = useState('');
  const [transferDestination, setTransferDestination] = useState('');
  const [transferQuantity, setTransferQuantity] = useState(0);
  const [transferReason, setTransferReason] = useState('');

  const loadBatteries = async () => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (brandFilter) params.brand = brandFilter;
    if (categoryFilter) params.category = categoryFilter;
    if (lowStockOnly) params.lowStockOnly = 'true';

    const query = new URLSearchParams(params).toString();
    const url = `${apiBase}/api/inventory${query ? `?${query}` : ''}`;
    const response = await axios.get<Battery[]>(url, { withCredentials: true });
    setBatteries(response.data);
  };

  const loadValuation = async () => {
    const response = await axios.get<Valuation>(`${apiBase}/api/inventory/valuation`, { withCredentials: true });
    setValuation(response.data);
  };

  useEffect(() => {
    loadBatteries();
    loadValuation();
  }, [search, brandFilter, categoryFilter, lowStockOnly]);

  const brands = useMemo(() => [...new Set(batteries.map((battery) => battery.brand))], [batteries]);
  const categories = useMemo(() => [...new Set(batteries.map((battery) => battery.category))], [batteries]);

  const refresh = async () => {
    await loadBatteries();
    await loadValuation();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this battery?')) return;
    await axios.delete(`${apiBase}/api/inventory/${id}`, { withCredentials: true });
    refresh();
  };

  const handleAdjust = async (id: string) => {
    const value = window.prompt('Enter adjustment amount (use negative values to remove stock):');
    if (!value) return;
    const amount = Number(value);
    if (Number.isNaN(amount)) {
      window.alert('Please enter a valid number');
      return;
    }
    const reason = window.prompt('Reason for adjustment (optional):') || undefined;
    await axios.post(`${apiBase}/api/inventory/${id}/adjust`, { adjustment: amount, reason }, { withCredentials: true });
    refresh();
  };

  const handleTransfer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!transferSource || !transferDestination) {
      window.alert('Select both source and destination batteries');
      return;
    }
    if (transferSource === transferDestination) {
      window.alert('Source and destination must be different');
      return;
    }
    if (transferQuantity <= 0) {
      window.alert('Transfer quantity must be greater than zero');
      return;
    }
    await axios.post(
      `${apiBase}/api/inventory/transfer`,
      {
        sourceBatteryId: transferSource,
        destinationBatteryId: transferDestination,
        quantity: transferQuantity,
        reason: transferReason || undefined,
      },
      { withCredentials: true },
    );
    setTransferQuantity(0);
    setTransferReason('');
    await refresh();
  };

  return (
    <main style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Inventory Management</h1>
          <p>Track battery stock, transfers, and valuation.</p>
        </div>
        <Link href="/inventory/create">
          <button style={{ padding: '10px 16px', cursor: 'pointer' }}>Add Battery</button>
        </Link>
      </header>

      <section style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
        <div>
          <strong>Total Stock Quantity:</strong> {valuation.totalQuantity}
          <br />
          <strong>Inventory Valuation:</strong> ${valuation.totalValue.toFixed(2)}
        </div>

        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search SKU, brand, category, voltage"
          />
          <select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}>
            <option value="">All brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <label>
            <input type="checkbox" checked={lowStockOnly} onChange={() => setLowStockOnly((value) => !value)} /> Low stock only
          </label>
        </div>
      </section>

      <section style={{ marginTop: '24px' }}>
        <h2>Battery Inventory</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Voltage</th>
              <th>Capacity</th>
              <th>Stock</th>
              <th>Low Threshold</th>
              <th>Purchase</th>
              <th>Selling</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batteries.map((battery) => {
              const isLow = battery.stockQuantity <= battery.lowStockThreshold;
              return (
                <tr key={battery.id} style={{ background: isLow ? '#fff4e5' : 'transparent' }}>
                  <td>{battery.sku}</td>
                  <td>{battery.brand}</td>
                  <td>{battery.category}</td>
                  <td>{battery.voltage}</td>
                  <td>{battery.capacityAh} Ah</td>
                  <td>{battery.stockQuantity}</td>
                  <td>{battery.lowStockThreshold}</td>
                  <td>${Number(battery.purchasePrice).toFixed(2)}</td>
                  <td>${Number(battery.sellingPrice).toFixed(2)}</td>
                  <td style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Link href={`/inventory/${battery.id}/edit`}>
                      <button>Edit</button>
                    </Link>
                    <button onClick={() => handleAdjust(battery.id)}>Adjust</button>
                    <button onClick={() => handleDelete(battery.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: '32px' }}>
        <h2>Transfer Stock</h2>
        <form onSubmit={handleTransfer} style={{ display: 'grid', gap: '12px', maxWidth: '720px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <label>
              Source battery
              <select value={transferSource} onChange={(event) => setTransferSource(event.target.value)}>
                <option value="">Select source</option>
                {batteries.map((battery) => (
                  <option key={battery.id} value={battery.id}>
                    {battery.sku} / {battery.brand}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Destination battery
              <select value={transferDestination} onChange={(event) => setTransferDestination(event.target.value)}>
                <option value="">Select destination</option>
                {batteries.map((battery) => (
                  <option key={battery.id} value={battery.id}>
                    {battery.sku} / {battery.brand}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <label>
              Quantity
              <input
                type="number"
                value={transferQuantity}
                min={1}
                onChange={(event) => setTransferQuantity(Number(event.target.value))}
              />
            </label>
            <label>
              Reason
              <input value={transferReason} onChange={(event) => setTransferReason(event.target.value)} placeholder="Optional note" />
            </label>
          </div>
          <button type="submit">Transfer stock</button>
        </form>
      </section>
    </main>
  );
}
