````markdown
# Monitoria-DevOps

Uma aplicação web **simples** de gerenciamento de monitorias acadêmicas, desenvolvida como estudo de caso para aplicação prática dos **conceitos e fundamentos DevOps** em um contexto universitário.

---

## 📖 Contexto

Este projeto foi criado como parte do Trabalho de Conclusão de Curso (TCC) do Curso de Graduação em Redes de Computadores da Universidade Federal do Ceará (Campus Quixadá). A proposta não é entregar um sistema completo de produção, mas demonstrar na prática:

- **Integração Contínua (CI)**: versionamento de código e pipelines automáticos de teste.  
- **Entrega Contínua (CD)**: build e deploy automatizados de front-end e back-end.  
- **Infraestrutura como Código** e práticas ágeis para organização do fluxo de trabalho.

O foco está em evidenciar como a cultura DevOps acelera, organiza e estabiliza o ciclo de vida de software.

---

## 🚀 Tecnologias

- **Front-end**: React + Vite + TailwindCSS  
- **Back-end**: NestJS + Prisma + PostgreSQL  
- **CI/CD**: GitHub Actions  
- **Deploy**: Vercel (front-end) & Render (back-end)  
- **Protótipos**: Figma

---

## 🏗️ Instalação e Execução Local

1. **Clone o repositório**  
   ```bash
   git clone https://github.com/fclucascastro/monitoria-devops.git
   cd monitoria-devops
````

2. **Configure variáveis de ambiente**

   * Copie e ajuste `monitoria-backend/.env.example` → `monitoria-backend/.env`
   * Copie e ajuste `monitoria-frontend/.env.example` → `monitoria-frontend/.env`

3. **Suba os serviços com Docker**

   ```bash
   cd monitoria-backend
   docker compose up --build
   ```

4. **Execute o front-end**

   ```bash
   cd ../monitoria-frontend
   npm install
   npm run dev
   ```

5. **Acesse**

   * Front-end: [http://localhost:5173](http://localhost:5173)
   * API: [http://localhost:3000/monitoria](http://localhost:3000/monitoria)

---

## ✅ CI/CD com GitHub Actions

O workflow de CI/CD automatiza:

1. Instalação de dependências
2. Testes do back-end (`npm test`)
3. Build do front-end (`npm run build`)
4. (Opcional) Deploy em staging/prod

**Localização do arquivo**:

```
.github/workflows/ci-cd.yml
```

---

## 📦 Deploy

* **Front-end**: [https://monitoria-devops.vercel.app](https://monitoria-devops.vercel.app)
* **Back-end**: hospedado no Render
* **Banco de dados**: PostgreSQL gratuito no Render

---

## 🤝 Contribuição

1. Abra uma *issue* para relatar bugs ou sugerir melhorias.
2. Faça um fork e crie uma branch (`feature/nome-da-feature`).
3. Abra um *pull request* para revisão.

---

## ⚖️ Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
Uso pessoal e acadêmico; fique à vontade para estudar ou adaptar.

---

> **Nota**
> A simplicidade deste sistema é proposital: o objetivo é demonstrar **boas práticas DevOps**, não recursos avançados de aplicação.

```
::contentReference[oaicite:0]{index=0}
```
