import { Button, PageHeading } from "../components/site";

export default function NotFound() {
  return <main className="wrap section missing"><PageHeading label="404" title="This page couldn’t be found." description="Explore our latest properties or head back to the homepage."/><Button href="/">Back to Home</Button></main>;
}
