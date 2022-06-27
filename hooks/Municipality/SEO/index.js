import { useContext, useState, useEffect } from 'react';
import { getStringFromPlaceholderText } from '../../../components/utils';
import { MunicipalityContext } from '../../../context/Municipality';

export const useSEO = page => {
  const { isMunicipality, isSpecific, municipality } =
    useContext(MunicipalityContext);

  const [title, setTitle] = useState();
  const [description, setDescription] = useState();

  useEffect(() => {
    if (isMunicipality) {
      if (isSpecific) {
        setTitle(getStringFromPlaceholderText(page.title, municipality));
        setDescription(
          getStringFromPlaceholderText(
            page.description?.internal?.content,
            municipality
          )
        );
      } else {
        setTitle(getStringFromPlaceholderText(page.title, undefined));
        setDescription(
          getStringFromPlaceholderText(
            page.description?.internal?.content,
            municipality
          )
        );
      }
    } else {
      setTitle(page.title);
      setDescription(page.description?.internal?.content);
    }
  }, [page, isMunicipality, municipality]);

  return { title, description };
};
