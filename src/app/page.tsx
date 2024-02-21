import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <header>
        <h1 className="text-5xl font-bold">Calvin Ellis</h1>
        <p className="text-2xl">Software Engineer</p>
      </header>
      <section className="flex flex-col items-center">
        <Image
          src="/calvin-ellis.jpg"
          alt="Calvin Ellis"
          width={300}
          height={300}
          className="rounded-full"
        />
        <p className="text-2xl mt-4">
          I am a software engineer based in the United States. I specialize in
          front-end development, with experience in back-end development and
          DevOps. I am passionate about creating beautiful, accessible, and
          performant web applications.
        </p>
      </section>

    </main>
  );
}
