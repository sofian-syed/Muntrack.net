import { Fragment } from "react";

// This is the interface that defines the properties of the ListGroup component, determining what props it can take
interface Props {
  items: Map<string, string>;
  heading: string;
}

// Here, we destructured the props object into its two properties, items and heading
// We could use the props object directly, with props.items and props.heading, but this is a cleaner way to do it

// On line 22 and 26, we have the classes from Boostrap, the "h2" class, the "list-group" class,
// the list-grpup-horizontal class, and the "list-group-item" class
// You can take a deeper look at the h2 class here: https://getbootstrap.com/docs/5.3/content/typography/#headings
// And a deeper look at the list-group class here: https://getbootstrap.com/docs/5.3/components/list-group/

// The 'key' prop is used by React to identify each element in the DOM, and it must be unique
// The key prop is not passed to the component, it is used by React internally
const InfoWidget = ({ items, heading }: Props) => {
  const id = heading.replace(/\s/g, "");
  return (
    <Fragment>
      <div className="h2 widget-heading" key={heading}>
        {heading}
      </div>
      {Array.from(items).map(([key, value]) => (
        <ul className="list-group list-group-horizontal" key={key + "list"}>
          <li className="list-group-item list-group-title" key={key}>
            {key}
          </li>
          <li className="list-group-item" key={`${key} value`} id={id + key}>
            {value}
          </li>
        </ul>
      ))}
    </Fragment>
  );
};

export default InfoWidget;
