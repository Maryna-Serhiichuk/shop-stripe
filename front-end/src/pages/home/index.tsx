import { FC } from 'react'
import { Content } from '../../components/sections/Content'
import { Hero } from '../../components/sections/Hero'
import { Section } from '../../components/sections/Section'
import magazine from './../../components/img/03.png'
import book from './../../components/img/04.png'

const Home: FC = () => {
    window.addEventListener('scroll', () => console.log(window.scrollY))
    return (
        <>
            <Section>
                <Hero
                    title={'Lorem Ipsum is simply dummy text of the printing'}
                    subtitle={"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose"}
                />
            </Section>
            <Section theme='dark'>
                <Content
                    image={magazine}
                    title='Magazines'
                    subtitle='You can order a subscription to the magazine according to your taste. Sport, science, news sports and other genres'
                    button={{text: 'Go', href: '/catalog'}}
                />
            </Section>
            <Section>
                <Content
                    image={book}
                    title='Books'
                    subtitle='You can buy a book of your favorite genre.'
                    button={{text: 'Go', href: '/catalog'}}
                    imagePosition={'right'}
                />
            </Section>
        </>
    )
}

export default Home