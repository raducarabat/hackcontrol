# ✨ Hackcontrol

An open-source hackathon management system built with Next.js & CockroachDB.

<div align="center">
<img src="public/images/screenshot.png">
</div>

## 🛠️ Stack

- **[Next.js](https://nextjs.org/)** with [TypeScript](https://www.typescriptlang.org/) - The React Framework for Production.
- **[Next-Auth](https://next-auth.js.org/)** - Authentication for Next.js.
- **[Prisma](https://www.prisma.io/)** with **[CockroachDB](https://www.cockroachlabs.com/)** - Next-generation Node.js and TypeScript ORM.
- **[tRPC 10](https://trpc.io/)** - End-to-end typesafe API.
- **[Tailwind CSS](https://tailwindcss.com/)** with [clsx](https://github.com/lukeed/clsx) - A utility-first CSS framework for rapidly building custom designs.
- **[Radix UI Primitives](https://www.radix-ui.com/)** - Unstyled, accessible components for building high‑quality design systems.
- **[Framer Motion](https://www.framer.com/motion/)** - A production-ready motion library for React.
- **[Iconoir icons](https://iconoir.com/)** - A set of 1000+ free MIT-licensed high-quality SVG icons.
- **[Prettier](https://prettier.io/)** with [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) - An opinionated code formatter + sort tailwindcss classes.
- **[React-Hook-Forms](https://react-hook-form.com/)** - Performant, flexible and extensible forms with easy-to-use validation.
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation.

## ✨ Features

**General:**

- [x] Authentication with Github.

**For the participant:**

- [x] The user can add his project.
- [ ] The user can edit his project before a deadline (soon).
- [ ] When the deadline is reached, the user can only see the project (soon).

**For the admin:**

- [x] The admin can add a new hackathon.
- [x] The admin can edit a hackathon.
- [x] The admin can delete a hackathon.
- [x] The admin can share the link to the hackathon.
- [x] The admin can see the list of projects.
- [x] The user can set a winner (mark a user as a winner).
- [x] The user can set a project as 'reviewed'.

## 🪐 Overview

- **/prisma** - Database schema.
- **/src/animations** - Framer motion animations.
- **/src/components** - All app components, built with Tailwind CSS.
- **/src/env** - Validate all environment variables with Zod.
- **/src/layout** - App header & footer.
- **/src/lib** - getServerAuthSession (next-auth) & Prisma library.
- **/src/pages/api** - Next-Auth config & tRPC api route.
- **/src/schema** - Hackathon & Participation Zod schemas.
- **/src/styles** - Tailwind CSS global styles + add custom font.
- **/src/trpc** - tRPC routers, initialization & global appRouter.
- **/src/types** - Hackathon, participation & next-auth types.
- **/src/ui** - All UI components built with Radix + Tailwind (clsx).
- **/src/ui/icons** - Iconoir icons.

## 🚀 Getting Started

### **Project settings:**

1. Clone the repository:

```bash
git clone https://github.com/[raducarabat]/hackcontrol.git
```

2. Navigate to the project directory:

```bash
cd hackcontrol
```

3. Install dependencies with your favorite package manager:

```bash
# with npm:
npm install

# with pnpm:
pnpm install

# with yarn:
yarn install
```

### **Environment variables:**

4. Create a `.env` file in the root of the project with the following variables:

```env
# CockroachDB connection string:
DATABASE_URL = ""

# Next-Auth config:
NEXTAUTH_SECRET="" # Generate a random string.
NEXTAUTH_URL="" # Your project url, e.g. http://localhost:3000.

# Github OAuth Provider:
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

### **CockroachDB settings:**

5. [**Create a free cluster**](https://www.cockroachlabs.com/docs/cockroachcloud/quickstart.html?#create-a-free-cluster).
6. [**Create a SQL user**](https://www.cockroachlabs.com/docs/cockroachcloud/quickstart.html?#create-a-sql-user).
7. To connect to the user, copy the connection string and paste it in the `.env` file,
   replacing the `DATABASE_URL` variable.

### **Github OAuth Provider settings:**

8. [Click here to create new Github OAuth app](https://github.com/settings/applications/new).
9. Go to "Client secrets" and generate new client secret and and paste it into GITHUB_CLIENT_SECRET env.
10. Copy the Client ID and paste it into GITHUB_ID env.

### **Run the project:**

11. Run in your terminal:

```bash
# with npm:
npm run dev

# with pnpm:
pnpm run dev

# with yarn:
yarn dev
```

and open [http://localhost:3000](http://localhost:3000) 🚀.

## 🙌 Contributing

If you want to add a new feature, fix a bug, improve the documentation or have an idea, feel free to create an issue or submit a pull request.

## 🔑 License

- [**MIT License**](LICENSE).
