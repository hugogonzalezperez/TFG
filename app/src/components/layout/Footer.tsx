import { ParkyLogo } from '../shared/ParkyLogo';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface AppFooterProps {
  sections?: FooterSection[];
}

const defaultSections: FooterSection[] = [
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre nosotros', href: '#' },
      { label: 'Cómo funciona', href: '#' },
      { label: 'Prensa', href: '#' },
      { label: 'Carreras', href: '#' },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { label: 'Centro de ayuda', href: '#' },
      { label: 'Contacto', href: '#' },
      { label: 'Seguridad', href: '#' },
      { label: 'Términos', href: '#' },
    ],
  },
  {
    title: 'Síguenos',
    links: [
      { label: 'Instagram', href: '#' },
      { label: 'Facebook', href: '#' },
      { label: 'Twitter', href: '#' },
      { label: 'LinkedIn', href: '#' },
    ],
  },
];

export function AppFooter({ sections = defaultSections }: AppFooterProps) {
  return (
    <footer className="bg-card text-foreground py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div>
            <div className="mb-4">
              <ParkyLogo size="md" />
            </div>
            <p className="text-muted-foreground">
              La forma más fácil de encontrar aparcamiento en Tenerife
            </p>
          </div>

          {/* Links sections */}
          {sections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-muted-foreground">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href} className="hover:text-foreground">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Parky. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}