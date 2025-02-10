import { algoliasearch } from "algoliasearch";
import prisma from "./lib/prisma";

const client = algoliasearch("VUXRF1ZAPV", "05222e5bb2a718722aceb3386bbd6e56");

// Fetch and index objects in Algolia
const processRecords = async () => {
  const services = await prisma.service.findMany({
    include: {
      category: true,
      user: true,
    },
  });

  const categories = await prisma.category.findMany();

  await client.replaceAllObjects({
    indexName: "services_index",
    objects: services,
  });

  await client.replaceAllObjects({
    indexName: "categories_index",
    objects: categories,
  });

  return {
    services,
    categories,
  };
};

processRecords()
  .then(({ services, categories }) =>
    console.log(
      `Successfully indexed ${services.length} services and ${categories.length} categories!`
    )
  )
  .catch((err) => console.error(err));
