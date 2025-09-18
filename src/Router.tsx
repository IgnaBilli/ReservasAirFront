import { useRoutes } from 'react-router-dom';
import { routeConfig } from './routes';

const Router = () => {
	const routes = useRoutes(routeConfig);
	return routes;
};

export default Router;