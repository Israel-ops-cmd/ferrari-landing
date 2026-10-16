// Dados da empresa. Troque os valores entre colchetes pelos dados reais.
export const company = {
  name: "Scuderia Ferrari",
  city: "Maranello",
  whatsapp: "390000000000", // número fictício de demonstração: troque pelo real, só dígitos com código do país
  whatsappMessage: "Olá! Vi o site e quero agendar um Drive Experience.",
  years: "97",
  clients: "3.200",
  countries: "41",
  founded: "1929",
  address: "Via Abetone Inferiore, 4, 41053 Maranello (MO), Itália",
  mapsQuery: "Via Abetone Inferiore 4, Maranello",
  instagram: "https://www.instagram.com/scuderiaferrari",
  responseTime: "15 minutos",
  routeKm: "60",
};

export function whatsappLink(message = company.whatsappMessage) {
  const digits = company.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { href: "#experiencias", label: "Experiências" },
  { href: "#por-que-nos", label: "Por que nós" },
  { href: "#clientes", label: "Clientes" },
  { href: "#nossa-casa", label: "Nossa casa" },
  { href: "#como-chegar", label: "Como chegar" },
];

export type Scene = {
  id: string;
  name: string;
  image: string;
  imageSmall: string;
  alt: string;
  headline: string;
  text: string;
  facts: [string, string][];
};

export const scenes: Scene[] = [
  {
    id: "maranello",
    name: "Maranello",
    image: "/img/showroom.webp",
    imageSmall: "/img/showroom-sm.webp",
    alt: "Ferrari SF90 Stradale vermelha no showroom escuro, com reflexo no piso preto",
    headline: "Sente no SF90 antes de decidir qualquer coisa.",
    text: "Você vem até a nossa casa, a gente abre o carro e você fica o tempo que quiser. Sem pressa e sem vendedor em cima.",
    facts: [
      ["Na vitrine", "SF90 Stradale"],
      ["Potência", "1.000 cv, motor V8 com três elétricos"],
      ["0 a 100 km/h", "2,5 segundos"],
      ["Visita", "Com hora marcada, só você e um consultor"],
    ],
  },
  {
    id: "cockpit",
    name: "Cockpit",
    image: "/img/cockpit.webp",
    imageSmall: "/img/cockpit-sm.webp",
    alt: "Volante Ferrari em fibra de carbono com manettino, botão Start Stop e luzes de troca de marcha",
    headline: "Aprenda a usar o manettino com quem pilota todo dia.",
    text: "Antes de ligar o motor, um instrutor senta do seu lado e explica cada botão do volante.",
    facts: [
      ["Instrução", "30 minutos no carro parado"],
      ["Modos", "Wet, Sport, Race e CT Off"],
      ["Instrutor", "Piloto com experiência em pista"],
      ["Você sai sabendo", "Quando trocar de modo e por quê"],
    ],
  },
  {
    id: "estrada",
    name: "Estrada",
    image: "/img/estrada.webp",
    imageSmall: "/img/estrada-sm.webp",
    alt: "Ferrari F8 Tributo vermelha fazendo curva numa estrada litorânea ao pôr do sol",
    headline: "720 cavalos nas curvas das colinas de Modena.",
    text: "Depois da instrução, a estrada é sua. O roteiro passa pelas serras ao redor de Maranello, com o instrutor no banco do passageiro.",
    facts: [
      ["Carro", "F8 Tributo"],
      ["Potência", "720 cv, V8 biturbo"],
      ["Velocidade máxima", "340 km/h"],
      ["Roteiro", `${company.routeKm} km pelas colinas de Modena`],
    ],
  },
];

export const services = [
  {
    title: "Drive Experience",
    text: "Dirija uma Ferrari de verdade, com instrutor do lado, em estrada aberta ou na pista. Você escolhe o modelo, a gente prepara o carro.",
    cta: "Agendar meu drive",
    message: "Olá! Quero agendar um Drive Experience.",
    image: "/img/estrada.webp",
    alt: "Ferrari F8 Tributo acelerando numa curva de estrada ao pôr do sol",
    stats: [
      { value: 720, suffix: " cv", label: "no F8 Tributo" },
      { value: 340, suffix: " km/h", label: "de velocidade máxima" },
    ],
  },
  {
    title: "Compra sob medida",
    text: "Do tom do couro à cor da costura, você monta o seu carro com a gente e acompanha cada etapa até a entrega.",
    cta: "Montar a minha Ferrari",
    message: "Olá! Quero montar uma Ferrari sob medida.",
    image: "/img/cockpit.webp",
    alt: "Interior Ferrari com volante em couro preto e costura branca",
  },
  {
    title: "Seminovos certificados",
    text: "Carros revisados por técnicos treinados na fábrica, com histórico completo e garantia.",
    cta: "Ver carros disponíveis",
    message: "Olá! Quero ver os seminovos disponíveis.",
  },
  {
    title: "Cuidado depois da compra",
    text: "Revisão, guarda do carro e busca na sua casa. Você só se preocupa em dirigir.",
    cta: "Falar sobre manutenção",
    message: "Olá! Quero falar sobre manutenção do meu carro.",
  },
];

export const differentials = [
  { figure: company.years, title: "anos vendendo Ferrari em Maranello.", text: "A gente conhece cada modelo pelo som do motor." },
  { figure: company.clients, title: "clientes atendidos.", text: "Muitos voltaram para o segundo, terceiro e quarto carro." },
  { figure: "Porta a porta", title: "Entrega em qualquer país.", text: "Cuidamos da papelada, do frete e da documentação no seu país." },
  { figure: "1", title: "consultor só para você.", text: "Do primeiro café até a revisão de dez anos, é sempre a mesma pessoa no seu WhatsApp." },
];

export const testimonials = [
  { quote: "Achei que ia ser só um passeio. Saí de lá com a data de entrega do meu 296 marcada.", name: "Ricardo M.", city: "São Paulo" },
  { quote: "O instrutor me deixou à vontade desde o primeiro minuto. Na segunda volta eu já estava no modo Race.", name: "Giulia F.", city: "Milão" },
  { quote: "Comprei de fora do país e não precisei me preocupar com nada. O carro chegou na minha garagem.", name: "James W.", city: "Londres" },
];

export const timeline = [
  { year: "1929", text: "Enzo Ferrari funda a Scuderia em Modena, com um grupo de pilotos amigos" },
  { year: "1943", text: "A fábrica muda para Maranello, onde está até hoje" },
  { year: "1947", text: "Sai pelo portão o primeiro carro com o nome Ferrari, o 125 S" },
  { year: "Hoje", text: `${company.clients} clientes e ${company.years} anos de casa` },
];

export const hours = [
  { day: "Segunda a sexta", time: "9h às 19h" },
  { day: "Sábado", time: "9h às 14h" },
  { day: "Domingo", time: "Só com hora marcada" },
];
