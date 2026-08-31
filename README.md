# 📅 Agendly - App de agendamentos

> **Gestão de agendamentos simples, moderna e eficiente para profissionais autônomos.**

O **Agendly** é uma aplicação web desenvolvida para profissionais que trabalham com horários marcados e precisam organizar seus clientes, serviços e agenda em um único lugar.

Além do sistema de gerenciamento, o Agendly permite criar uma **página pública de agendamento**, facilitando que clientes escolham um serviço, uma data e um horário disponível.

---

## ✨ Funcionalidades

### 📊 Dashboard

* Visão geral dos agendamentos
* Organização das principais informações
* Acesso rápido às funcionalidades do sistema

### 📅 Agenda

* Visualização dos horários
* Criação e gerenciamento de agendamentos
* Organização da rotina de atendimento

### 👥 Clientes

* Cadastro de clientes
* Gerenciamento das informações
* Histórico de clientes

### 💼 Serviços

* Cadastro de serviços
* Definição de valores
* Definição da duração dos serviços

### 🌐 Página pública de agendamento

* Página personalizada para cada profissional
* Exibição dos serviços disponíveis
* Seleção de data
* Seleção de horário
* Realização de agendamento pelo cliente

### 👥 Equipe

* Gerenciamento de membros da equipe
* Sistema de convites
* Controle de permissões

### 💳 Assinaturas

* Planos para profissionais e equipes
* Integração com Stripe
* Gerenciamento de assinatura

### 🔐 Autenticação e segurança

* Cadastro e login
* Autenticação com Firebase
* Controle de acesso
* Regras de segurança no Firestore

---

## 🛠️ Tecnologias utilizadas

### Front-end

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)

### Back-end

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge\&logo=express\&logoColor=white)

### Banco de dados e serviços

![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge\&logo=firebase\&logoColor=black)
![Firestore](https://img.shields.io/badge/Firestore-FFCA28?style=for-the-badge\&logo=firebase\&logoColor=black)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge\&logo=stripe\&logoColor=white)

### Bibliotecas

* React Router
* Framer Motion
* FullCalendar

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura separando a aplicação em diferentes responsabilidades:

```text
Agendly
│
├── Front-end
│   ├── React
│   ├── React Router
│   ├── Context API
│   └── Firebase
│
├── Back-end
│   ├── Node.js
│   ├── Express
│   └── Firebase Admin
│
├── Banco de dados
│   └── Cloud Firestore
│
└── Pagamentos
    └── Stripe
```

---

## 🔥 Firebase

O Firebase é utilizado para diferentes funcionalidades da aplicação:

* Firebase Authentication
* Cloud Firestore
* Firebase Admin
* Controle de acesso aos dados

Principais coleções utilizadas:

```text
usuarios
empresas
clientes
agendamentos
servicos
equipe
convites
suporte
```

---

## 💳 Stripe

O Agendly utiliza o **Stripe** para gerenciamento de assinaturas.

O fluxo de pagamento inclui:

```text
Usuário
   ↓
Escolha do plano
   ↓
Stripe Checkout
   ↓
Pagamento
   ↓
Backend
   ↓
Atualização da assinatura
   ↓
Firestore
```

---

## 📱 Responsividade

A aplicação foi desenvolvida pensando em diferentes tamanhos de tela, incluindo:

* 💻 Desktop
* 📱 Smartphones
* 📲 Tablets
* Se tornou um app funcional na loja da GooglePlay

---

## 🚀 Objetivo do projeto

O Agendly nasceu como um projeto prático para desenvolver uma aplicação próxima de um produto real, trabalhando não apenas o front-end, mas também:

* Autenticação
* Banco de dados
* APIs
* Pagamentos
* Controle de acesso
* Responsividade
* Deploy
* Experiência do usuário

O projeto também serve como um ambiente de aprendizado contínuo em **desenvolvimento Full Stack**.

---

## 📚 Aprendizados

Durante o desenvolvimento do Agendly, foram trabalhados conceitos como:

* Desenvolvimento de aplicações React
* Gerenciamento de estado
* React Router
* Integração com Firebase
* Modelagem de dados no Firestore
* Autenticação
* APIs REST
* Desenvolvimento de backend com Node.js e Express
* Integração com Stripe
* Webhooks
* Controle de permissões
* Deploy de aplicações
* Desenvolvimento responsivo
* Organização de projetos

---

## 👩‍💻 Desenvolvedora

Desenvolvido por **Chaiane Gerevini**.

🔗 [GitHub](https://github.com/ChaianeGerevini)
