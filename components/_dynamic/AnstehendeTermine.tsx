import AnstehendeTermine from '../Termine/AnstehendeTermine';

type AnstehendeTermineDynamicProps = {
  listAll: boolean;
};
const AnstehendeTermineDynamic = ({
  listAll,
}: AnstehendeTermineDynamicProps) => {
  return <AnstehendeTermine listAll={listAll} />;
};

export default AnstehendeTermineDynamic;
