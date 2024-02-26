import Header from "@/components/Header/Header";
import { LetsConnectWidget } from "@/components/LetsConnectWidget/LetsConnectWidget";

export default function Contact() {
  return (
    <>
      <div className="text-center px-4">
        <Header as="h1">Lets Connect</Header>
      </div>
      <LetsConnectWidget />
    </>
  );
}
