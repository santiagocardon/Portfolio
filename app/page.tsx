import { SwitchMode } from "@/components/SwitchMode";
import { TypeText } from "@/components/TypeText";
import { Reveal, Magnetic, Decrypt } from "@/components/Effects";
import { ProjectsScroll } from "@/components/ProjectsScroll";
import { PinnedAbout } from "@/components/PinnedAbout";
import { MobileMenu } from "@/components/MobileMenu";
import { profile, status, stackGlance, about, skills, education, languages, projects } from "@/content";

function Section({ n, id, title, children }: { n: string; id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id}>
      <h2><span className="label">{`// ${n}`}</span> <TypeText text={title} onView /></h2>
      <Reveal>{children}</Reveal>
    </section>
  );
}

const NAV = [
  { label: "proyectos", href: "#proyectos" },
  { label: "sobre mí", href: "#sobre-mi" },
  { label: "habilidades", href: "#habilidades" },
  { label: "formación", href: "#formacion" },
  { label: "contacto", href: "#contacto" },
];

function CvButton() {
  return (
    <Magnetic>
      <a className="btn" href={profile.cv} download data-decrypt>
        <span aria-hidden="true">&gt; </span><Decrypt text="descargar cv" trigger="hover" />
      </a>
    </Magnetic>
  );
}

function MailButton() {
  const subject = encodeURIComponent("Oportunidad de prácticas / puesto junior backend Java");
  return (
    <Magnetic>
      <a className="btn" href={`mailto:${profile.email}?subject=${subject}`} data-decrypt>
        <span aria-hidden="true">&gt; </span><Decrypt text="escribirme" trigger="hover" />
      </a>
    </Magnetic>
  );
}

export default function Home() {
  return (
    <>
      <header className="bar">
        <span className="prompt">santiago@madrid:~$</span>
        <nav>
          {NAV.map((n) => (
            <Magnetic key={n.href}><a href={n.href}><Decrypt text={n.label} trigger="hover" /></a></Magnetic>
          ))}
        </nav>
        <MobileMenu items={NAV} />
        <SwitchMode />
      </header>

      <main>
        <section className="hero">
          <p className="label">&gt; hola, soy</p>
          <h1 className="glitch" data-text={profile.name}>
            <TypeText text={profile.name} speed={70} delay={300} />
          </h1>
          <p className="role"><TypeText text={profile.role} speed={28} delay={1900} keepCursor /></p>
          <p className="stack-line">{stackGlance}</p>
          <div className="hero-actions">
            <p className="status"><span className="dot" aria-hidden="true" />{status}</p>
            <CvButton />
            <MailButton />
          </div>
        </section>

        {/* Scroll horizontal: no va dentro de <Reveal> porque es muy alto y no se revelaría a tiempo */}
        <section id="proyectos">
          <h2><span className="label">{"// 01"}</span> <TypeText text="proyectos" onView /></h2>
          <ProjectsScroll projects={projects} />
        </section>

        {/* Fijo mientras se revela el texto: no va dentro de <Reveal> porque es muy alto */}
        <section id="sobre-mi" className="pin-section">
          <PinnedAbout text={about} />
        </section>

        <Section n="03" id="habilidades" title="habilidades">
          <dl>
            {skills.map((s) => (
              <div key={s.group} className="row">
                <dt>{s.group}</dt>
                <dd><Decrypt text={s.items} trigger="view" duration={900} /></dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section n="04" id="formacion" title="formación">
          <dl>
            {education.map((e) => (
              <div key={e.title} className="row">
                <dt>{e.period}</dt>
                <dd>{e.title}<br /><span className="muted">{e.school}</span></dd>
              </div>
            ))}
            <div className="row"><dt>idiomas</dt><dd>{languages}</dd></div>
          </dl>
        </Section>

        <Section n="05" id="contacto" title="contacto">
          <p><Magnetic><a href={`mailto:${profile.email}`}><Decrypt text={profile.email} trigger="both" /></a></Magnetic></p>
          {profile.linkedin && <p><Magnetic><a href={profile.linkedin}>linkedin</a></Magnetic></p>}
          {profile.github && <p><Magnetic><a href={profile.github}>github</a></Magnetic></p>}
          <p style={{ marginTop: 16 }}><CvButton /></p>
        </Section>
      </main>

      <footer><p className="muted">{profile.location}</p></footer>
    </>
  );
}