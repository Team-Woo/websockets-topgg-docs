import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import { Button } from "./components/ui/button";
import Link from "next/link";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Separator } from "./components/ui/separator";

const processString = (str: string) => {
  return str
    .toLowerCase() // Convert to lowercase
    .replace(/\s/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]/g, ""); // Remove all non-word characters except hyphens
};

type LibEventParameter = {
  name: string;
  type: string;
  link: string;
}


export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Separator,
    // Allows customizing built-in components, e.g. to add styling.
    Highlight: ({ children }) => {
      return <span className="bg-slate-900 px-1 rounded text-primary">{children}</span>;
    },
    h1: ({ children }) => {
      const processedString = processString(children as string);
      return <h1 id={processedString}>{children}</h1>;
    },
    h2: ({ children }) => {
      const processedString = processString(children as string);
      return (
        <h2 id={processedString} data-docs-heading>
          <Link href={"#" + processedString}>{children}</Link>
        </h2>
      );
    },
    h3: ({ children }) => {
      const processedString = processString(children as string);
      return (
        <h3 id={processedString} data-docs-heading>
          <Link href={"#" + processedString}>{children}</Link>
        </h3>
      );
    },
    img: (props) => (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image sizes="100vw" style={{ width: "100%", height: "auto" }} {...(props as ImageProps)} />
    ),

    a: (props) => <Link {...props} className="underline"></Link>,
    Button: ({ children, props }) => <Button {...props}>{children}</Button>,
    SyntaxHighlighter: ({ children, language }) => {
      return (
        <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ borderRadius: "0.25rem" }}>
          {children}
        </SyntaxHighlighter>
      );
    },

    ApiEndpoint: (params: {
      title: string;
      endpoint: string;
      type: "get" | "post" | "delete" | "patch" | "put" | "options";
      description: string;
      requestProperties?: { name: string; type: string; description: string }[];
      responseProperties?: {
        name: string;
        type: string;
        description: string;
        properties?: { name: string; type: string; description: string }[];
      }[];
      example?: string;
    }) => {
      const { title, endpoint, type, description, responseProperties, requestProperties, example } = params;
      const processedString = processString(title);
      return (
        <div className="p-4 rounded-md">
          <h2 id={processedString} data-docs-heading className="">
            <Link href={"#" + processedString}>{title}</Link>
          </h2>
          <div
            style={{
              width: "100%",
              backgroundColor: "hsl(var(--accent))",
              padding: ".5rem",
              borderRadius: ".5rem",
              border: "1px solid hsl(var(--accent-foreground))",
              display: "flex",
              gap: ".5rem",
            }}
          >
            <span className="font-bold">{type}</span>
            <span className="mr-[auto]">{endpoint}</span>
          </div>
          <div className="pt-8">{description}</div>

          <div className="pt-8 ignore-markdown">
            <Accordion type="single" collapsible>
              {requestProperties && (
                <AccordionItem value="request-props">
                  <AccordionTrigger>
                    <h2 className="ignore-markdown">Request Fields</h2>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableCaption>The Request for {title} endpoint</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requestProperties?.map((response, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>{response.name}</TableCell>
                              <TableCell>{response.type}</TableCell>
                              <TableCell>{response.description}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              )}
              {responseProperties && (
                <AccordionItem value="response-properties">
                  <AccordionTrigger>
                    <h2 className="ignore-markdown text-2xl font-bold mb-2">Response Fields</h2>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableCaption>The response when requesting the {title} endpoint</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {responseProperties?.map((response, index) => {
                          return (
                            <React.Fragment key={index}>
                              <TableRow>
                                <TableCell>{response.name}</TableCell>
                                <TableCell>{response.type}</TableCell>
                                <TableCell>{response.description}</TableCell>
                              </TableRow>
                              {response.properties?.map((property, propertyIndex) => (
                                <TableRow key={propertyIndex}>
                                  <TableCell>{response.name + "." + property.name}</TableCell>
                                  <TableCell>{property.type}</TableCell>
                                  <TableCell>{property.description}</TableCell>
                                </TableRow>
                              ))}
                            </React.Fragment>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              )}
              {example && (
                <AccordionItem value="example">
                  <AccordionTrigger>
                    <h2 className="ignore-markdown text-2xl font-bold mb-2">Example Response</h2>
                  </AccordionTrigger>
                  <AccordionContent>
                    <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ borderRadius: "0.25rem" }}>
                      {example}
                    </SyntaxHighlighter>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>
      );
    },
    ApiType: (params: {
      title: string;
      description: string;
      typeProperties?: { name: string; type: string; description: string }[];
    }) => {
      const { title, description, typeProperties } = params;
      const processedString = processString(title);
      return (
        <div className="">
          <h2 id={processedString} data-docs-heading className="scroll-mt-4">
            <Link href={"#" + processedString}>{title}</Link>
          </h2>
          <div className="pt-8">{description}</div>
          <div className="pt-8 ignore-markdown">
            <Accordion type="single" collapsible>
              {typeProperties && (
                <AccordionItem value="response-properties">
                  <AccordionTrigger>
                    <h2 className="ignore-markdown text-2xl font-bold mb-2">Structure</h2>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableCaption>The {title} Object</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {typeProperties?.map((response, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>{response.name}</TableCell>
                              <TableCell>{response.type}</TableCell>
                              <TableCell>{response.description}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>
      );
    },

    WebsocketReceivedMessage: (params: {
      title: string;
      description: string;
      opcode: number;
      responseProperties?: {
        name: string;
        type: string;
        description: string;
        properties?: {
          name: string;
          type: string;
          description: string;
          properties?: { name: string; type: string; description: string }[]; // This is the new line
        }[];
      }[];
      example?: string;
    }) => {
      const { title, description, opcode, responseProperties, example } = params;
      const processedString = processString(title);
      return (
        <div className="rounded-md pt-8" style={{ background: "rgb(30, 30, 30)", padding: "1rem", paddingTop: "2rem", marginBottom: "2rem", }}>
          <h2 id={processedString} data-docs-heading className="ignore-markdown">
            <Link href={"#" + processedString}>{title}</Link>
          </h2>
          <div className="">Opcode: {opcode}</div>
          <div className="pt-8">{description}</div>


          <div className="pt-8 ignore-markdown">
            <Accordion type="single" collapsible>
              <AccordionItem value="response-properties">
                <AccordionTrigger>
                  <h2 className="ignore-markdown text-2xl font-bold mb-2">Response Data</h2>
                </AccordionTrigger>
                <AccordionContent>
                  {responseProperties && (
                    <Table className="">
                      <TableCaption>The top-level properties in the response when requesting the endpoint</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(responseProperties).map(([name, { type, description }]) => (
                          <TableRow key={name}>
                            <TableCell>{name}</TableCell>
                            <TableCell>{type}</TableCell>
                            <TableCell>{description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  {Object.entries(responseProperties ?? {})
                    .filter(([, { type }]) => type === "object")
                    .map(([name, { properties }]) => (
                      <React.Fragment key={name}>
                        <h3 className="text-xl font-bold mt-4">{name} Properties</h3>
                        <Table>
                          <TableCaption>
                            The {name} object properties in the response when requesting the endpoint
                          </TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Property</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Description</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {properties?.map((property, propertyIndex) => (
                              <TableRow key={propertyIndex}>
                                <TableCell>{property.name}</TableCell>
                                <TableCell>{property.type}</TableCell>
                                <TableCell>{property.description}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </React.Fragment>
                    ))}
                </AccordionContent>
              </AccordionItem>
              {example && (
                <AccordionItem value="example">
                  <AccordionTrigger>
                    <h2 className="ignore-markdown text-2xl font-bold mb-2">Example Data</h2>
                  </AccordionTrigger>
                  <AccordionContent>
                    <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ borderRadius: "0.25rem" }}>
                      {example}
                    </SyntaxHighlighter>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>
      );
    },

    LibEvent: ({ title, description, parameters, example }: { title: string, description: string, parameters: LibEventParameter[], example?: string, anchor?: string }) => {
      const processedString = processString(title);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "2rem" }} data-docs-heading id={processedString}>
          <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            <h2 className="ignore-markdown" style={{ display: "inline" }}>
              <Link href={"#" + processedString} className="underline">{title}</Link>
            </h2>
            ({parameters.length > 0 && (
              <span className="font-semibold text-gray-600">
                {parameters.map((param, index) => (
                  <span key={param.name}>
                    {index > 0 ? ", " : ""}
                    <span>{param.name}: </span>
                    {param.link && (
                      <Link className="underline" href={param.link}>{param.type}</Link>
                    ) || (
                        param.type
                      )}
                  </span>
                ))}
              </span>

            )})
          </div>
          <div>{description}</div>
          {
            example && (
              <Accordion type="single" collapsible>
                <AccordionItem value="example">
                  <AccordionTrigger>
                    <h2 className="ignore-markdown text-2xl font-bold mb-2">Example Code</h2>
                  </AccordionTrigger>
                  <AccordionContent>
                    <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ borderRadius: "0.25rem" }}>
                      {example}
                    </SyntaxHighlighter>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )
          }
        </div >
      )
    },


    table: (params) => {
      return <Table >{params.children}</Table>;
    },
    thead: (params) => {
      return <TableHeader>{params.children}</TableHeader>;
    },
    tbody: (params) => {
      return <TableBody>{params.children}</TableBody>;
    },
    tr: (params) => {
      return <TableRow>{params.children}</TableRow>;
    },
    th: (params) => {
      return <TableHead>{params.children}</TableHead>;
    },
    td: (params) => {
      return <TableCell>{params.children}</TableCell>;
    },


    ...components,
  };
}
