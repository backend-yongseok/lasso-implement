import Link from "next/link"

type PageLink = {
  name: string
  path: string
}

const Navigation: React.FC = () => {
  const pageLinks: PageLink[] = [
    "rayCasting",
    "rayCasting+greedSearch",
    "rayCasting+quardTree",
    "windingNumber",
    "convexHull",
  ].map((file) => ({
    name: file,
    path: `/${file}`,
  }))

  return (
    <nav>
      <ul>
        {pageLinks.map((pageLink) => (
          <li key={pageLink.path}>
            <Link href={pageLink.path}>{pageLink.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
