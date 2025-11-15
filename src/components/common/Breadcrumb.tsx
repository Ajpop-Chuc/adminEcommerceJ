import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  pageName: string;
  parent?: string;
  parentLink?: string;
}

const Breadcrumb = ({ pageName, parent, parentLink }: BreadcrumbProps) => {
  return (
   <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          {parent && parentLink ? (
            <li>
              <Link className="font-medium text-gray-500 hover:text-brand-500" to={parentLink}>
                {parent} /
              </Link>
            </li>
          ) : (
            <li>
              <Link className="font-medium text-gray-500 hover:text-brand-500" to="/TailAdmin/">
                Dashboard /
              </Link>
            </li>
          )}
          <li className="font-medium text-brand-500">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;