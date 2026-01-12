/**
 * Gerador de dados mock para o sistema Pedido Rápido
 * Este arquivo gera dados realistas para desenvolvimento
 */

// Produtos base por categoria
const productTemplates = {
  bebidas: [
    { name: 'Caipirinha Tradicional', price: 18.90, prepTime: 5 },
    { name: 'Caipirinha de Frutas', price: 22.90, prepTime: 5 },
    { name: 'Cerveja Long Neck', price: 12.90, prepTime: 1 },
    { name: 'Cerveja Artesanal', price: 18.90, prepTime: 1 },
    { name: 'Refrigerante Lata', price: 6.90, prepTime: 1 },
    { name: 'Água Mineral', price: 4.90, prepTime: 1 },
    { name: 'Água de Coco', price: 8.90, prepTime: 2 },
    { name: 'Suco Natural', price: 12.90, prepTime: 5 },
    { name: 'Limonada Suíça', price: 14.90, prepTime: 5 },
    { name: 'Piña Colada', price: 28.90, prepTime: 8 },
    { name: 'Mojito', price: 26.90, prepTime: 6 },
    { name: 'Sex on the Beach', price: 32.90, prepTime: 6 },
    { name: 'Margarita', price: 28.90, prepTime: 6 },
    { name: 'Batida de Coco', price: 18.90, prepTime: 5 },
    { name: 'Chopp 300ml', price: 9.90, prepTime: 2 }
  ],
  petiscos: [
    { name: 'Porção de Batata Frita', price: 32.90, prepTime: 15 },
    { name: 'Isca de Peixe', price: 48.90, prepTime: 18 },
    { name: 'Camarão Empanado', price: 68.90, prepTime: 20 },
    { name: 'Lula à Dorê', price: 58.90, prepTime: 18 },
    { name: 'Bolinho de Bacalhau', price: 42.90, prepTime: 15 },
    { name: 'Casquinha de Siri', price: 28.90, prepTime: 12 },
    { name: 'Pastel de Camarão', price: 18.90, prepTime: 10 },
    { name: 'Coxinha de Frango', price: 8.90, prepTime: 8 },
    { name: 'Queijo Coalho', price: 15.90, prepTime: 8 },
    { name: 'Espetinho de Carne', price: 12.90, prepTime: 10 },
    { name: 'Tábua de Frios', price: 78.90, prepTime: 10 },
    { name: 'Bruschetta', price: 28.90, prepTime: 12 }
  ],
  pratosQuentes: [
    { name: 'Moqueca de Peixe', price: 89.90, prepTime: 35 },
    { name: 'Moqueca de Camarão', price: 109.90, prepTime: 35 },
    { name: 'Bobó de Camarão', price: 98.90, prepTime: 30 },
    { name: 'Peixe Grelhado', price: 68.90, prepTime: 25 },
    { name: 'Camarão na Moranga', price: 128.90, prepTime: 40 },
    { name: 'Lagosta Grelhada', price: 189.90, prepTime: 35 },
    { name: 'Arroz de Polvo', price: 98.90, prepTime: 35 },
    { name: 'Filé de Peixe ao Molho', price: 72.90, prepTime: 28 },
    { name: 'Risoto de Frutos do Mar', price: 88.90, prepTime: 30 },
    { name: 'Espaguete ao Camarão', price: 68.90, prepTime: 25 },
    { name: 'Caldeirada de Frutos do Mar', price: 98.90, prepTime: 35 }
  ],
  sobremesas: [
    { name: 'Pudim de Leite', price: 14.90, prepTime: 3 },
    { name: 'Mousse de Maracujá', price: 16.90, prepTime: 3 },
    { name: 'Petit Gateau', price: 24.90, prepTime: 12 },
    { name: 'Sorvete 2 Bolas', price: 18.90, prepTime: 3 },
    { name: 'Açaí 300ml', price: 22.90, prepTime: 5 },
    { name: 'Açaí 500ml', price: 32.90, prepTime: 5 },
    { name: 'Torta de Limão', price: 16.90, prepTime: 3 },
    { name: 'Brownie com Sorvete', price: 22.90, prepTime: 8 },
    { name: 'Cocada', price: 8.90, prepTime: 1 },
    { name: 'Banana Flambada', price: 28.90, prepTime: 10 }
  ],
  cafeDaManha: [
    { name: 'Tapioca Simples', price: 12.90, prepTime: 8 },
    { name: 'Tapioca Recheada', price: 18.90, prepTime: 10 },
    { name: 'Cuscuz com Ovo', price: 16.90, prepTime: 12 },
    { name: 'Pão na Chapa', price: 8.90, prepTime: 5 },
    { name: 'Café com Leite', price: 6.90, prepTime: 3 },
    { name: 'Vitamina de Frutas', price: 14.90, prepTime: 5 },
    { name: 'Omelete', price: 22.90, prepTime: 12 },
    { name: 'Pão de Queijo', price: 6.90, prepTime: 8 },
    { name: 'Sanduíche Natural', price: 18.90, prepTime: 10 },
    { name: 'Mingau de Aveia', price: 12.90, prepTime: 8 }
  ],
  acarajes: [
    { name: 'Acarajé Tradicional', price: 18.90, prepTime: 12 },
    { name: 'Acarajé Especial', price: 24.90, prepTime: 15 },
    { name: 'Abará', price: 16.90, prepTime: 10 },
    { name: 'Vatapá', price: 28.90, prepTime: 15 }
  ],
  caranguejos: [
    { name: 'Caranguejo Inteiro', price: 45.90, prepTime: 25 },
    { name: 'Patinha de Caranguejo', price: 58.90, prepTime: 20 },
    { name: 'Casquinha de Caranguejo', price: 32.90, prepTime: 15 },
    { name: 'Caranguejo ao Alho', price: 68.90, prepTime: 28 }
  ]
};

// Ingredientes base
const ingredientTemplates = [
  { name: 'Camarão Rosa', unit: 'kg', cost: 75.00, minStock: 5 },
  { name: 'Peixe Fresco', unit: 'kg', cost: 45.00, minStock: 8 },
  { name: 'Lula', unit: 'kg', cost: 55.00, minStock: 4 },
  { name: 'Lagosta', unit: 'kg', cost: 180.00, minStock: 2 },
  { name: 'Polvo', unit: 'kg', cost: 95.00, minStock: 3 },
  { name: 'Caranguejo', unit: 'unit', cost: 15.00, minStock: 20 },
  { name: 'Leite de Coco', unit: 'l', cost: 12.00, minStock: 10 },
  { name: 'Azeite de Dendê', unit: 'l', cost: 28.00, minStock: 5 },
  { name: 'Arroz', unit: 'kg', cost: 6.00, minStock: 20 },
  { name: 'Feijão Fradinho', unit: 'kg', cost: 12.00, minStock: 10 },
  { name: 'Batata', unit: 'kg', cost: 8.00, minStock: 15 },
  { name: 'Cebola', unit: 'kg', cost: 5.00, minStock: 10 },
  { name: 'Alho', unit: 'kg', cost: 35.00, minStock: 3 },
  { name: 'Tomate', unit: 'kg', cost: 8.00, minStock: 10 },
  { name: 'Pimentão', unit: 'kg', cost: 12.00, minStock: 5 },
  { name: 'Limão', unit: 'kg', cost: 6.00, minStock: 8 },
  { name: 'Cachaça', unit: 'l', cost: 18.00, minStock: 10 },
  { name: 'Vodka', unit: 'l', cost: 45.00, minStock: 5 },
  { name: 'Rum', unit: 'l', cost: 38.00, minStock: 5 },
  { name: 'Tequila', unit: 'l', cost: 65.00, minStock: 3 },
  { name: 'Açúcar', unit: 'kg', cost: 4.50, minStock: 15 },
  { name: 'Gelo', unit: 'kg', cost: 3.00, minStock: 50 },
  { name: 'Cerveja Long Neck', unit: 'unit', cost: 4.50, minStock: 100 },
  { name: 'Refrigerante Lata', unit: 'unit', cost: 2.50, minStock: 80 },
  { name: 'Água Mineral', unit: 'unit', cost: 1.50, minStock: 100 },
  { name: 'Leite Condensado', unit: 'unit', cost: 6.00, minStock: 20 },
  { name: 'Creme de Leite', unit: 'unit', cost: 4.50, minStock: 20 },
  { name: 'Ovos', unit: 'dozen', cost: 12.00, minStock: 10 },
  { name: 'Farinha de Trigo', unit: 'kg', cost: 5.00, minStock: 15 },
  { name: 'Farinha de Mandioca', unit: 'kg', cost: 7.00, minStock: 10 },
  { name: 'Óleo de Soja', unit: 'l', cost: 8.00, minStock: 10 },
  { name: 'Sal', unit: 'kg', cost: 2.50, minStock: 10 },
  { name: 'Coentro', unit: 'pack', cost: 3.00, minStock: 15 },
  { name: 'Cheiro Verde', unit: 'pack', cost: 3.50, minStock: 15 },
  { name: 'Pimenta', unit: 'kg', cost: 45.00, minStock: 1 },
  { name: 'Açaí Polpa', unit: 'kg', cost: 35.00, minStock: 10 },
  { name: 'Banana', unit: 'kg', cost: 6.00, minStock: 8 },
  { name: 'Morango', unit: 'kg', cost: 25.00, minStock: 5 },
  { name: 'Granola', unit: 'kg', cost: 22.00, minStock: 5 },
  { name: 'Mel', unit: 'l', cost: 45.00, minStock: 3 },
  { name: 'Queijo Coalho', unit: 'kg', cost: 38.00, minStock: 5 },
  { name: 'Bacon', unit: 'kg', cost: 55.00, minStock: 4 },
  { name: 'Frango', unit: 'kg', cost: 18.00, minStock: 10 },
  { name: 'Carne Bovina', unit: 'kg', cost: 45.00, minStock: 8 },
  { name: 'Massa Espaguete', unit: 'kg', cost: 8.00, minStock: 10 },
  { name: 'Vinho Branco', unit: 'l', cost: 35.00, minStock: 5 },
  { name: 'Coco Ralado', unit: 'kg', cost: 28.00, minStock: 3 },
  { name: 'Chocolate em Pó', unit: 'kg', cost: 32.00, minStock: 3 },
  { name: 'Café', unit: 'kg', cost: 42.00, minStock: 5 },
  { name: 'Leite', unit: 'l', cost: 5.00, minStock: 20 }
];

export { productTemplates, ingredientTemplates };

