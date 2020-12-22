interface PropsType {
  [props: string]: any;
}

const filterProps = (props: PropsType, toRemove: string[]) => {
  let filteredProps = { ...props };
  toRemove.forEach((key) => {
    if (Object.keys(filteredProps).includes(key)) delete filteredProps[key];
  });
  return filteredProps;
};

export default filterProps;
