import Link from "next/link";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import UserLinkWithToolTip from "../shared/UserLinkWithToolTip";

// PROPS
interface LinkifyLinksProps {
  children: React.ReactNode;
}

// COMPONENT
export default function LinkifyLinks({ children }: LinkifyLinksProps) {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
}

// LINKIFY URLS
function LinkifyUrl({ children }: LinkifyLinksProps) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
}

// LINKIFY USERNAME
function LinkifyUsername({ children }: LinkifyLinksProps) {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => {
        // get username
        const username = match.slice(1);
        // return link
        return (
          <UserLinkWithToolTip username={username} key={key}>
            {match}
          </UserLinkWithToolTip>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}

// LINKIFY HASHTAG
function LinkifyHashtag({ children }: LinkifyLinksProps) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9_-]+)/}
      component={(match, key) => {
        // get hastag
        const hastag = match.slice(1);
        // return link
        return (
          <Link
            href={`/hastag/${hastag}`}
            key={key}
            className="text-primary hover:underline"
          >
            {match}
          </Link>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}
