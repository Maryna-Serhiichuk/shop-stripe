import {FC} from "react";
import {Section} from "../sections/Section";
import {Outlet} from "react-router-dom";

const AuthLayout: FC = () => {
    return <Section>
        <Outlet />
    </Section>
}

export { AuthLayout }