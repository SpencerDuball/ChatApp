interface PropsType {
  [props: string]: any;
}

const filterProps = (args: {
  props: PropsType;
  toRemove: string[];
}): PropsType => {
  let filteredProps = { ...args.props };
  args.toRemove.forEach((key) => {
    if (Object.keys(filteredProps).includes(key)) delete filteredProps[key];
  });
  return filteredProps;
};

export default filterProps;
