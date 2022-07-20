import ListDownload from '../ListDownload';

type ListDownloadDynamicProps = {
  signaturesId?: string;
};

const ListDownloadDynamic = ({
  signaturesId = 'berlin-2',
}: ListDownloadDynamicProps) => {
  return <ListDownload signaturesId={signaturesId} />;
};

export default ListDownloadDynamic;
