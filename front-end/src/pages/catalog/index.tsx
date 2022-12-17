import { FC } from 'react'
import { Section } from '../../components/sections/Section'
import { List as CatalogList } from './List'

const Catalog: FC = () => {
    return (
        <Section>
            <CatalogList/>
        </Section>
    )
}

export default Catalog