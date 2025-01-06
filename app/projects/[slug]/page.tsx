import { notFound } from 'next/navigation';
import {allProjects} from '.contentlayer/generated'
import { Mdx } from '@/app/components/mdx';
import { Header } from './header';
import './mdx.css';
import { ReportView } from './view';
import { Redis } from '@upstash/redis';

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

const redis = Redis.fromEnv();

export async function generateStaticParams(): Promise<Props['params'][]> {
  return allProjects
    .map((p: { slug: any; }) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  // Destructure params to access slug directly
  const { slug } = params;

  if (!slug) {
    return notFound(); // Handle missing slug
  }

  const project = allProjects.find((project: { slug: string; }) => project.slug === slug);

  if (!project) {
    return notFound(); // Handle missing project
  }

  const views =
    (await redis.get<number>(['pageviews', 'projects', slug].join(':'))) ?? 0;

  return (
    <div className="bg-zinc-50 min-h-screen">
      <Header project={project} views={views} />
      <ReportView slug={project.slug} />

      <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
        <Mdx code={project.body.code} />
      </article>
    </div>
  );
}