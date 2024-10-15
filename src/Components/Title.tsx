import { ReactNode } from "react";

// This creates the Title component, which is a div with the class "title" and the children of the component
// Children are the elements inside of the component, in this case, the text inside of the div
const Title = ({ children }: { children: ReactNode }) => {
  return <div className="title">{children}</div>;
};

export default Title;
