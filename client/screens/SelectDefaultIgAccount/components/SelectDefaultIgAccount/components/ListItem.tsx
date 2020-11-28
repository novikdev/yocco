import styled from 'styled-components/native';

const ListItemContainer = styled.View`
  padding: 10px;
  background-color: white;
  flex-direction: row;
  border-radius: 10px;
`;

const ListItemContent = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  margin-left: 10px;
`;

const ListItem = ListItemContainer as typeof ListItemContainer & {
  Content: typeof ListItemContent;
};

ListItem.Content = ListItemContent;

export { ListItem };
