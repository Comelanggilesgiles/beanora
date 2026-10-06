export type Drink = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tone: 'caramel' | 'sage' | 'espresso';
};

export const drinks: Drink[] = [
  {
    id: 'caramel-latte',
    name: 'Caramel Latte',
    description: 'Rich espresso, silky milk, a little caramel magic.',
    price: 4.5,
    image: '/images/caramel-latte.jpg',
    tone: 'caramel',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Bold espresso beneath a cloud of creamy foam.',
    price: 3.9,
    image: '/images/cappuccino.jpg',
    tone: 'sage',
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    description: 'Slow-steeped, smooth, and refreshingly simple.',
    price: 4.2,
    image: '/images/cold-brew.jpg',
    tone: 'espresso',
  },
];

export type DrinkSize = 'Regular' | 'Large';
export type Milk = 'Whole milk' | 'Oat milk' | 'Almond milk' | 'No milk';
export type Temperature = 'Hot' | 'Iced';

export type CartItem = {
  id: string;
  drinkId: string;
  size: DrinkSize;
  milk: Milk;
  temperature: Temperature;
  quantity: number;
  unitPrice: number;
};

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

export function getUnitPrice(drink: Drink, size: DrinkSize, milk: Milk) {
  return drink.price + (size === 'Large' ? 0.8 : 0) + (milk === 'Oat milk' || milk === 'Almond milk' ? 0.5 : 0);
}

export function readSavedCart(): CartItem[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem('beanora-bag') || '[]');
    if (!Array.isArray(saved)) return [];
    // Recalculate prices so an old saved bag always uses the current menu.
    return saved.flatMap((value: unknown) => {
      if (!value || typeof value !== 'object') return [];
      const item = value as Partial<CartItem>;
      const drink = drinks.find((entry) => entry.id === item.drinkId);
      const validSize = item.size === 'Regular' || item.size === 'Large';
      const validMilk = ['Whole milk', 'Oat milk', 'Almond milk', 'No milk'].includes(item.milk || '');
      const validTemperature = item.temperature === 'Hot' || item.temperature === 'Iced';
      if (!drink || !validSize || !validMilk || !validTemperature || !Number.isInteger(item.quantity) || !item.quantity || item.quantity < 1 || item.quantity > 99) return [];
      const size = item.size as DrinkSize;
      const milk = item.milk as Milk;
      const temperature = item.temperature as Temperature;
      return [{
        id: `${drink.id}-${size}-${milk}-${temperature}`,
        drinkId: drink.id,
        size,
        milk,
        temperature,
        quantity: item.quantity,
        unitPrice: getUnitPrice(drink, size, milk),
      }];
    });
  } catch {
    return [];
  }
}