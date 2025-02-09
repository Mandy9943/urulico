import prisma from "@/lib/prisma";
import PublicarClientSide from "./client";

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return categories;
}

export default async function PublicarPage() {
  const categories = await getCategories();

  return <PublicarClientSide categories={categories} />;
}
