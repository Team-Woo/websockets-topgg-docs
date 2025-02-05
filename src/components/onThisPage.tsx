import React, { ReactNode, Children, isValidElement } from 'react'
import GithubSlugger from 'github-slugger'

const baseLevel = 0

type HeadingItem = {
    text: string
    slug: string
    level: number
}

interface OnThisPageProps {
    content: React.ReactElement<ComponentHeadingProps>
}

const HEADING_LEVELS = ['h2', 'h3', 'h4', 'h5', 'h6'] as const
type HeadingTag = typeof HEADING_LEVELS[number]

const HEADING_OFFSET_MAP: Record<HeadingTag, string> = {
    h2: '0',
    h3: '1rem',
    h4: '2rem',
    h5: '3rem',
    h6: '4rem'
}

interface ComponentHeadingProps {
    anchor?: string
    level?: number
    children?: React.ReactNode
    mdxType?: string
}

const getNodeText = (node: ReactNode): string => {
    if (typeof node === 'string') return node
    if (typeof node === 'number') return node.toString()
    if (Array.isArray(node)) return node.map(getNodeText).join('')
    if (isValidElement(node)) return getNodeText((node.props as ComponentHeadingProps).children)
    return ''
}

const useHeadings = (content: React.ReactElement<ComponentHeadingProps>) => {
    const slugger = new GithubSlugger()
    const headings: HeadingItem[] = []

    const traverseChildren = (children: ReactNode) => {
        Children.forEach(children, (child) => {
            if (!isValidElement(child)) return

            const props = child.props as ComponentHeadingProps
            let mdxType: string | undefined;

            if (typeof child.type === "string") {
                mdxType = child.type;
            } else if (typeof child.type === "function") {
                mdxType = child.type.name;
            }
            if (mdxType === undefined) return;

            if (HEADING_LEVELS.includes(mdxType as HeadingTag)) {
                const textContent = getNodeText(props.children)
                headings.push({
                    text: textContent,
                    slug: slugger.slug(textContent),
                    level: Number(mdxType[1])
                })
            } else if (props.anchor) {
                headings.push({
                    text: props.anchor,
                    slug: slugger.slug(props.anchor),
                    level: props.level ?? baseLevel,
                })
            }

            if (props.children) {
                traverseChildren(props.children)
            }
        })
    }

    traverseChildren(content.props.children)
    return headings
}

const OnThisPage: React.FC<OnThisPageProps> = ({ content }) => {
    const headings = useHeadings(content)

    if (headings.length === 0) return null

    return (
        <nav className="sticky top-20">
            <h2 className="text-lg font-semibold mb-3">On this page</h2>
            <ul className="space-y-2">
                {headings.map(({ text, slug, level }) => (
                    <li
                        key={slug}
                        style={{
                            paddingLeft: HEADING_OFFSET_MAP[`h${level}` as HeadingTag],
                            marginLeft: level > 2 ? '0.5rem' : 0
                        }}
                        className="text-sm hover:text-primary transition-colors"
                    >
                        <a href={`#${slug}`} className="block">
                            {text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default OnThisPage