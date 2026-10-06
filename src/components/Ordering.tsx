import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, Coffee, Download, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Modal from './Modal';
import { drinks, formatPrice, getUnitPrice, type CartItem, type Drink, type DrinkSize, type Milk, type Temperature } from '../data';

type QuantityProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
};

function Quantity({ value, onChange, min = 1, max = 20, label = 'drink' }: QuantityProps) {
  return <div className="quantity-control">
    <button type="button" aria-label={`Remove one ${label}`} onClick={() => onChange(value - 1)} disabled={value <= min}><Minus size={15} /></button>
    <span aria-live="polite">{value}</span>
    <button type="button" aria-label={`Add one ${label}`} onClick={() => onChange(value + 1)} disabled={value >= max}><Plus size={15} /></button>
  </div>;
}

export function DrinkModal({ drink, onClose, onAdd }: { drink: Drink; onClose: () => void; onAdd: (item: CartItem) => void }) {
  const [size, setSize] = useState<DrinkSize>('Regular');
  const [milk, setMilk] = useState<Milk>(drink.id === 'cold-brew' ? 'No milk' : 'Whole milk');
  const [temperature, setTemperature] = useState<Temperature>(drink.id === 'cappuccino' ? 'Hot' : 'Iced');
  const [quantity, setQuantity] = useState(1);
  const unitPrice = getUnitPrice(drink, size, milk);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAdd({ id: `${drink.id}-${size}-${milk}-${temperature}`, drinkId: drink.id, size, milk, temperature, quantity, unitPrice });
  }

  return <Modal title="Your coffee, your way." onClose={onClose}>
    <form className="drink-customizer" onSubmit={submit}>
      <div className={`order-product tone-${drink.tone}`}>
        <img src={drink.image} alt={drink.name} width={150} height={150} />
        <div><span className="eyebrow">A BEANORA FAVORITE</span><h3>{drink.name}</h3><p>{drink.description}</p><strong>{formatPrice(drink.price)}</strong></div>
      </div>
      {drink.id !== 'cold-brew' && <fieldset className="option-fieldset">
        <legend>How do you like it?</legend>
        <div className="segmented-options">
          {(['Hot', 'Iced'] as Temperature[]).map((option) => <label key={option} className={temperature === option ? 'selected' : ''}>
            <input type="radio" name="temperature" value={option} checked={temperature === option} onChange={() => setTemperature(option)} /><span>{option}</span>
          </label>)}
        </div>
      </fieldset>}
      <fieldset className="option-fieldset">
        <legend>A little or a little more?</legend>
        <div className="segmented-options size-options">
          {(['Regular', 'Large'] as DrinkSize[]).map((option) => <label key={option} className={size === option ? 'selected' : ''}>
            <input type="radio" name="size" value={option} checked={size === option} onChange={() => setSize(option)} />
            <span>{option} <small>{option === 'Regular' ? '12 oz' : '16 oz / +$0.80'}</small></span>
          </label>)}
        </div>
      </fieldset>
      <label className="checkout-field"><span>Your milk</span>
        <select value={milk} onChange={(event) => setMilk(event.target.value as Milk)}>
          <option>Whole milk</option><option value="Oat milk">Oat milk (+$0.50)</option><option value="Almond milk">Almond milk (+$0.50)</option><option>No milk</option>
        </select>
      </label>
      <div className="order-quantity-row"><span>How many happy moments?</span><Quantity value={quantity} onChange={setQuantity} /></div>
      <button className="button button-green full-width" type="submit"><ShoppingBag size={17} /> Add to my bag <span className="button-price">{formatPrice(unitPrice * quantity)}</span></button>
    </form>
  </Modal>;
}

type Receipt = {
  reference: string;
  name: string;
  email: string;
  pickupAt: string;
  items: CartItem[];
  total: number;
};

type BagProps = {
  items: CartItem[];
  onClose: () => void;
  onQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onExplore: () => void;
};

export function BagDrawer({ items, onClose, onQuantity, onRemove, onClear, onExplore }: BagProps) {
  const [phase, setPhase] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [pickupMinutes, setPickupMinutes] = useState(20);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState('');
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    if (!name || !email) {
      setError('Please enter your name and email address.');
      return;
    }
    const next: Receipt = {
      reference: `BN-${Date.now().toString(36).slice(-6).toUpperCase()}`,
      name,
      email,
      pickupAt: new Date(Date.now() + pickupMinutes * 60_000).toISOString(),
      items: [...items],
      total,
    };
    try { localStorage.setItem('beanora-last-order', JSON.stringify(next)); } catch { /* The receipt still works when browser storage is unavailable. */ }
    setReceipt(next);
    setPhase('confirmed');
    onClear();
  }

  function downloadReceipt() {
    if (!receipt) return;
    const lines = receipt.items.map((item) => {
      const drink = drinks.find((entry) => entry.id === item.drinkId);
      return `${item.quantity} x ${drink?.name} (${item.size}, ${item.temperature}, ${item.milk}) - ${formatPrice(item.unitPrice * item.quantity)}`;
    });
    const text = [
      'BEANORA / A LITTLE MOMENT. A BETTER DAY.',
      `Demo order: ${receipt.reference}`,
      `Name: ${receipt.name}`,
      `Pickup: ${new Date(receipt.pickupAt).toLocaleString()}`,
      '', ...lines, '', `Total: ${formatPrice(receipt.total)}`, '',
      'This is a demo receipt. No payment was collected and no order was sent to a cafe.',
    ].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `beanora-${receipt.reference.toLowerCase()}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <Modal title={phase === 'checkout' ? 'A little coffee break.' : phase === 'confirmed' ? 'A better day is brewing.' : 'Your coffee bag.'} onClose={onClose} drawer>
    {phase === 'confirmed' && receipt ? <div className="order-confirmation">
      <span className="confirmation-icon"><Check size={30} /></span>
      <span className="eyebrow">THANK YOU, {receipt.name.split(' ')[0].toUpperCase()}</span>
      <h3>Your ritual, ready to go.</h3>
      <p>Your demo order has been created. Here are the details of your coffee break.</p>
      <dl className="receipt-details">
        <div><dt>Order number</dt><dd>{receipt.reference}</dd></div>
        <div><dt>Estimated pickup</dt><dd>{new Date(receipt.pickupAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</dd></div>
        <div><dt>Your total</dt><dd>{formatPrice(receipt.total)}</dd></div>
      </dl>
      <p className="demo-note dark-note">This is a demo checkout. No payment was taken, and no order or email was sent to a cafe.</p>
      <button className="button button-green full-width" onClick={downloadReceipt}><Download size={16} /> Download your receipt</button>
      <button className="text-button" onClick={onClose}>Back to better days <ArrowRight size={15} /></button>
    </div> : phase === 'checkout' ? <div className="checkout-view">
      <button className="text-button back-to-bag" onClick={() => setPhase('bag')}><ArrowLeft size={14} /> Back to your bag</button>
      <p className="checkout-intro">Skip the queue. Keep the ritual.<br />Let's put a name on your favorites.</p>
      <form onSubmit={checkout} className="checkout-form" onChange={() => setError('')}>
        <label className="checkout-field"><span>Your name</span><input name="name" autoComplete="name" placeholder="Alex Coffee-Lover" maxLength={80} required /></label>
        <label className="checkout-field"><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={120} required /></label>
        <label className="checkout-field"><span>When should we have it ready?</span><select value={pickupMinutes} onChange={(event) => setPickupMinutes(Number(event.target.value))}><option value={20}>As soon as possible (about 20 minutes)</option><option value={30}>In 30 minutes</option><option value={45}>In 45 minutes</option><option value={60}>In an hour</option></select></label>
        <div className="checkout-summary"><span>{count} {count === 1 ? 'coffee' : 'coffees'}, made your way</span><strong>{formatPrice(total)}</strong></div>
        {error && <p className="checkout-error" role="alert">{error}</p>}
        <button className="button button-green full-width" type="submit">Create demo pickup order <ArrowRight size={16} /></button>
        <p className="demo-note dark-note">Demo checkout. No payment is collected and no order is sent. Your receipt is saved on this device.</p>
      </form>
    </div> : items.length === 0 ? <div className="empty-bag">
      <span className="empty-bag-icon"><Coffee size={43} strokeWidth={1.3} /></span>
      <h3>A little empty.<br />Full of possibilities.</h3>
      <p>Your next favorite cup is waiting. Pick something good from our signature menu.</p>
      <button className="button button-green" onClick={onExplore}>Find my favorite <ArrowRight size={16} /></button>
    </div> : <div className="filled-bag">
      <p className="bag-intro">{count} {count === 1 ? 'little moment' : 'little moments'} of happiness.</p>
      <div className="bag-items">
        {items.map((item) => {
          const drink = drinks.find((entry) => entry.id === item.drinkId);
          if (!drink) return null;
          return <article className="bag-item" key={item.id}>
            <img src={drink.image} alt={drink.name} width={80} height={96} />
            <div className="bag-item-info"><h3>{drink.name}</h3><p>{item.temperature} / {item.size}<br />{item.milk}</p><Quantity value={item.quantity} min={0} max={99} onChange={(quantity) => onQuantity(item.id, quantity)} label={drink.name} /></div>
            <div className="bag-item-end"><strong>{formatPrice(item.unitPrice * item.quantity)}</strong><button className="icon-button" onClick={() => onRemove(item.id)} aria-label={`Remove ${drink.name} from bag`}><Trash2 size={16} /></button></div>
          </article>;
        })}
      </div>
      <div className="bag-bottom">
        <div className="bag-subtotal"><span>Subtotal</span><strong>{formatPrice(total)}</strong></div>
        <p>Freshly made. Ready for your little coffee break.</p>
        <button className="button button-green full-width" onClick={() => setPhase('checkout')}>Continue to pickup <ArrowRight size={16} /></button>
        <button className="text-button" onClick={onExplore}>A little more browsing</button>
      </div>
    </div>}
  </Modal>;
}