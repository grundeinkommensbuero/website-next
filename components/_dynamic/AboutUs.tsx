import { useEffect, useState } from 'react';
import fetchData from '../../utils/fetchData';
import AboutUs, { TeamMember } from '../AboutUs';

const AboutUsDynamic = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>();

  useEffect(() => {
    getTeamMembers().then(members => setTeamMembers(members));
  }, []);

  return <AboutUs members={teamMembers} />;
};

const query = `query teamMembers {
  teamMembers(sort: "date_created", filter: {status: {_eq: "published"}}) {
    id
    name
    image {
      id
    }
    twitter
    linkedin
    website
    role
  }
}
`;

const variables = {
  variables: {},
};

export const getTeamMembers = async () => {
  const teamMembers: TeamMember[] = await fetchData(query, variables).then(
    data => {
      return data.data.teamMembers;
    }
  );

  return teamMembers;
};

export default AboutUsDynamic;
