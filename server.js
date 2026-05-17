const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory orders store
const orders = {};

function generateOrderId() {
  return 'BLK' + Date.now() + Math.floor(Math.random() * 1000);
}

function getDeliveryStages(orderedAt) {
  const now = Date.now();
  const elapsed = now - orderedAt;
  const min = 60 * 1000;

  const stages = [
    { key: 'ordered',    label: '주문 완료',      icon: '✅', delay: 0 },
    { key: 'paid',       label: '결제 완료',      icon: '💳', delay: 1 * min },
    { key: 'preparing',  label: '상품 준비 중',   icon: '📦', delay: 3 * min },
    { key: 'shipped',    label: '배송 출발',      icon: '🚚', delay: 6 * min },
    { key: 'transit',   label: '배송 중',        icon: '🛣️',  delay: 10 * min },
    { key: 'nearby',    label: '근처 도착',      icon: '📍', delay: 15 * min },
    { key: 'delivered', label: '배송 완료',      icon: '🎉', delay: 20 * min },
  ];

  let currentStageIndex = 0;
  for (let i = stages.length - 1; i >= 0; i--) {
    if (elapsed >= stages[i].delay) {
      currentStageIndex = i;
      break;
    }
  }

  return stages.map((s, i) => ({
    ...s,
    done: i <= currentStageIndex,
    current: i === currentStageIndex,
    time: i <= currentStageIndex
      ? new Date(orderedAt + s.delay).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      : null,
  }));
}

app.post('/api/order', (req, res) => {
  const { items, total, address } = req.body;
  const orderId = generateOrderId();
  orders[orderId] = {
    orderId,
    items,
    total,
    address,
    orderedAt: Date.now(),
  };
  res.json({ orderId });
});

app.get('/api/order/:id', (req, res) => {
  const order = orders[req.params.id];
  if (!order) return res.status(404).json({ error: '주문을 찾을 수 없습니다' });

  res.json({
    ...order,
    stages: getDeliveryStages(order.orderedAt),
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BlackCard Shop running on port ${PORT}`);
});
