import { Row, Segmented, List as ListAnt, Col, Card, Avatar, Typography, Button } from "antd";
import { AppstoreOutlined, BarsOutlined, ShoppingCartOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { FC, useState } from "react";
import { Book } from "../../types/types";
import { NavLink } from "react-router-dom";

export const list: Book[] = [
    {
        id: '1',
        name: "Harry Potter and Philosopher's Stone",
        author: 'Joan Roaling',
        year: 1997,
        description: "The a 1997 fantasy novel written by British author J. K. Rowling. The first novel in the Harry Potter series and Rowling's debut novel, it follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday, when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry.",
        image: "https://content2.rozetka.com.ua/goods/images/original/72555843.jpg",
        price: 27.90,
        genres: ['fantasy'],
        created: '2022-12-09'
    },
    {
        id: '2',
        name: "Harry Potter and Chamber of Secrets",
        author: 'Joan Roaling',
        year: 1998,
        description: `The fantasy novel written by British author J. K. Rowling and the second novel in the Harry Potter series. The plot follows Harry's second year at Hogwarts School of Witchcraft and Wizardry, during which a series of messages on the walls of the school's corridors warn that the "Chamber of Secrets" has been opened and that the "heir of Slytherin" would kill all pupils who do not come from all-magical families. These threats are found after attacks that leave residents of the school petrified. Throughout the year, Harry and his friends Ron and Hermione investigate the attacks.`,
        image: "https://stylus.ua/thumbs/390x390/ce/c2/1441771.jpeg",
        price: 28.90,
        genres: ['fantasy'],
        created: '2022-12-09'
    },
    {
        id: '3',
        name: "Harry Potter and Prisoner of Azkaban",
        author: 'Joan Roaling',
        year: 1999,
        description: "The fantasy novel written by British author J. K. Rowling and is the third in the Harry Potter series. The book follows Harry Potter, a young wizard, in his third year at Hogwarts School of Witchcraft and Wizardry. Along with friends Ronald Weasley and Hermione Granger, Harry investigates Sirius Black, an escaped prisoner from Azkaban, the wizard prison, believed to be one of Lord Voldemort's old allies.",
        image: "https://m.media-amazon.com/images/I/51vsSNLsBgL._AC_SY780_.jpg",
        price: 31.80,
        genres: ['fantasy'],
        created: '2022-12-09'
    },
    {
        id: '4',
        name: "Harry Potter and Goblet of Fire",
        author: 'Joan Roaling',
        year: 2000,
        description: "The fantasy novel written by British author J. K. Rowling and the fourth novel in the Harry Potter series. It follows Harry Potter, a wizard in his fourth year at Hogwarts School of Witchcraft and Wizardry, and the mystery surrounding the entry of Harry's name into the Triwizard Tournament, in which he is forced to compete.",
        image: "https://m.media-amazon.com/images/I/51vsSNLsBgL._AC_SY780_.jpg",
        price: 36.90,
        genres: ['fantasy'],
        created: '2022-12-09'
    },
    {
        id: '5',
        name: "Harry Potter and Order of the Phoenix",
        author: 'Joan Roaling',
        year: 2003,
        description: "The fantasy novel written by British author J. K. Rowling and the fifth novel in the Harry Potter series. It follows Harry Potter's struggles through his fifth year at Hogwarts School of Witchcraft and Wizardry, including the surreptitious return of the antagonist Lord Voldemort, O.W.L. exams, and an obstructive Ministry of Magic. The novel was published on 21 June 2003 by Bloomsbury in the United Kingdom, Scholastic in the United States, and Raincoast in Canada. It sold five million copies in the first 24 hours of publication.",
        image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/70/Harry_Potter_and_the_Order_of_the_Phoenix.jpg/220px-Harry_Potter_and_the_Order_of_the_Phoenix.jpg",
        price: 39.90,
        genres: ['fantasy'],
        created: '2022-12-09'
    },
    {
        id: '6',
        name: "Harry Potter and Half-Blood Prince",
        author: 'Joan Roaling',
        year: 2005,
        description: "The  fantasy novel written by British author J.K. Rowling and the sixth and penultimate novel in the Harry Potter series. Set during Harry Potter's sixth year at Hogwarts, the novel explores the past of the boy wizard's nemesis, Lord Voldemort, and Harry's preparations for the final battle against Voldemort alongside his headmaster and mentor Albus Dumbledore.",
        image: "https://upload.wikimedia.org/wikipedia/en/b/b5/Harry_Potter_and_the_Half-Blood_Prince_cover.png",
        price: 34.90,
        genres: ['fantasy'],
        created: '2022-12-09'
    },
    {
        id: '7',
        name: "Harry Potter and Deathly Hallows",
        author: 'Joan Roaling',
        year: 2007,
        description: "The fantasy novel written by British author J. K. Rowling and the seventh and final novel of the main Harry Potter series. It was released on 21 July 2007 in the United Kingdom by Bloomsbury Publishing, in the United States by Scholastic, and in Canada by Raincoast Books. The novel chronicles the events directly following Harry Potter and the Half-Blood Prince (2005) and the final confrontation between the wizards Harry Potter and Lord Voldemort.",
        image: "https://m.media-amazon.com/images/I/51jyI6lYi1L._AC_SY780_.jpg",
        price: 38.90,
        genres: ['fantasy'],
        created: '2022-12-09'
    },
]

const List: FC = () => {

    const [segment, setSegment] = useState<'horizontal'|'vertical'>('vertical')

    return (
        <Row>
            <Col>
                <Row>
                    <Segmented
                        onChange={e => setSegment(e)}
                        options={[
                        {
                            value: 'horizontal',
                            icon: <BarsOutlined />,
                        },
                        {
                            value: 'vertical',
                            icon: <AppstoreOutlined />,
                        },
                        ]}
                    />
                </Row>
                <Row>
                    <ListAnt
                        grid={{ gutter: 50, column: 4 }}
                        itemLayout={segment}
                        // loadMore={loadMore}
                        dataSource={list}
                        renderItem={(item) => (
                            <NavLink to={`/order/${item.id}`}>
                                <ListAnt.Item>
                                <Card
                                    style={{ width: 300 }}
                                    cover={
                                    <img
                                        style={{height: '300px', objectFit: 'contain'}}
                                        alt={item.name}
                                        src={item.image}
                                    />
                                    }
                                    actions={[
                                        <Button type={'primary'}>
                                            <ShoppingCartOutlined />
                                        </Button>,
                                        <Typography.Title level={5}>{item.price} $</Typography.Title>
                                    ]}
                                >
                                    <Card.Meta
                                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                        title={item.name}
                                        description={item.description.substring(0, 100)}
                                    />
                                </Card>
                            </ListAnt.Item>
                            </NavLink>
                        )}
                    />
                </Row>
            </Col>
        </Row>
    )
}

export { List }