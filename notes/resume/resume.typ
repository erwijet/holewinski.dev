#set text(font: "Inter", fill: rgb("#222222"), size: 10pt, hyphenate: false)
#show heading.where(level: 1): set text(font: "General Sans", tracking: 1em / 23)
#show heading.where(level: 2): set text(font: "General Sans", weight: "semibold")

#show link: underline
#set page(
  margin: (x: 1.1cm, y: 1.3cm),
)
#set par(justify: true)

#let divider() = {
  v(-2pt)
  line(length: 100%, stroke: rgb("#777777"))
  v(-5pt)
}

#let section(content) = {
  divider()
  heading(content)
}

//

#text(15pt)[= TYLER HOLEWINSKI]

#box[
  #link("https://holewinski.dev")[holewinski.dev] #text(gray)[$space.hair$|$space.hair$]
  #link("mailto:tyler@holewinski.dev")[tyler\@holewinski.dev] #text(gray)[$space.hair$|$space.hair$]
  #link("https://github.com/erwijet")[github.com/erwijet] #text(gray)[$space.hair$|$space.hair$]
  #link("https://linkedin.com/in/tylerholewinski")[/in/tylerholewinski] #text(gray)[$space.hair$|$space.hair$]
  #link("tel:+17198225878")[719.822.5878]
]

== EDUCATION
#divider()

Rochester Institute of Technology, _School of Independent Study_ \
*B.S. Applied Arts and Science* (completed part-time) \
*Focus in Software Engineering and Mathematics*

== WORK EXPERIENCE
#divider()

*Software Engineer II* #h(1fr) #text(gray)[May 2024 -- Present] \
Bryx, Inc. #text(gray)[--- _Rochester, NY_]
- Acted as frontend technical lead, setting architecture, standards, and review practices across multiple products.
- Designed and implemented Kotlin and GraphQL APIs for a mission-critical emergency mass notification system used by public safety agencies.
- Took primary ownership of the a message delivery API, designing message lifecycles and multi-channel delivery (SMS, push, email, voice).
- Delivered end-to-end features spanning database design, backend implementation, and frontend interfaces.
- Integrated OpenTelemetry across frontend and backend services, improving observability and production reliability.

*Frontend Software Engineer I* #h(1fr) #text(gray)[Aug 2022 -- May 2024] \
Bryx, Inc. #text(gray)[--- _Rochester, NY_]
- Designed and implemented an internal DSL and compiler for declarative validation of complex NFIRS and NERIS forms.
- Built a dependency-aware validation system with batched state updates to preserve React performance.
- Served as frontend subject-matter expert for form-heavy and mapping features, influencing architectural decisions.

*Intern Software Engineer* #h(1fr) #text(gray)[May 2022 -- Aug 2022] \
Bryx, Inc. #text(gray)[--- _Rochester, NY_]
- Developed core frontend functionality for a SaaS records management system focused on high configurability for fire departments.
- Designed and implemented a custom-field-based personnel management system, demoed to leadership and prospective clients.

== SELECTED WORK
#divider()

*TiCoder* — #link("https://ticoder.dev")[ticoder.dev]
- Built a browser-based TI-BASIC editor and compiler using Blockly, enabling students to visually compose and deploy programs without proprietary tools.
- Developed companion libraries including better-blockly for typesafe Blockly block definitions and a Rust toolchain (tibrs) for TI-BASIC binary compilation.

== EDUCATION
#divider()

Rochester Institute of Technology, _School of Independent Study_ \
*B.S. Applied Arts and Science* (completed part-time) \
*Focus in Software Engineering and Mathematics*

== SKILLS
#divider()

- *Frontend Systems* TypeScript, React, GraphQL, Complex Form & Validation Workflows
- *Backend Systems* Kotlin, Node.js, PostgreSQL, Event-Driven & Message-Oriented Architectures, API Design
- *Observability & Tooling* OpenTelemetry, RabbitMQ, Grafana, Docker, CI/CD, Linux
