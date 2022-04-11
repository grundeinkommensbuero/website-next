import React, { ChangeEvent, useRef } from 'react';
import { useState, useEffect, useLayoutEffect } from 'react';
import { InputSize, TextInput } from '../TextInput';
import LabelInputErrorWrapper from '../LabelInputErrorWrapper';
import s from './style.module.scss';
import cN from 'classnames';
import { Button, ButtonSize } from '../Button';

import Fuse from 'fuse.js';
import { Municipality } from '../../../context/Municipality';

// const handleButtonClickDefault = ({
//   validate,
// }: {
//   validate: () => { status: 'success' };
// }) => {
//   // If no place was selected, we check if the top result
//   // has a very good score, if yes -> navigate to the page
//   // of that place
//   // --> validate function
//   const validation = validate();
//   if (validation.status === 'success') {
//     navigate(validation.slug);
//   }
// };

export type MunicipalityWithScore = Municipality & { score: number };

const initPlace = {
  name: '',
  ags: '',
  slug: '',
  score: 0,
  nameUnique: '',
  zipCodes: [],
};

type SearchPlacesProps = {
  showButton?: boolean;
  buttonLabel: string;
  placeholder?: string;
  onPlaceSelect: (suggestion?: Municipality) => void;
  label: string;
  searchTitle?: string;
  validateOnBlur?: boolean;
  inputSize?: InputSize;
  buttonSize?: ButtonSize;
  profileButtonStyle?: boolean;
  isInsideForm?: boolean;
  fullWidthInput?: boolean;
  handleButtonClick: (arg: any) => void;
  initialPlace?: MunicipalityWithScore;
};

export const SearchPlaces = ({
  showButton,
  buttonLabel = 'Finde deine Stadt',
  placeholder = 'Stadt oder Gemeinde',
  onPlaceSelect,
  label = 'Stadt oder Gemeinde:',
  searchTitle,
  validateOnBlur,
  inputSize,
  buttonSize,
  profileButtonStyle,
  isInsideForm,
  fullWidthInput = false,
  handleButtonClick = () => {},
  initialPlace = initPlace,
}: SearchPlacesProps) => {
  const [query, setQuery] = useState(initialPlace.name || '');
  const [results, setResults] = useState<MunicipalityWithScore[]>([]);
  const [selectedPlace, setSelectedPlace] = useState(initialPlace);
  const [suggestionsActive, setSuggestionsActive] = useState<boolean>(false);
  const [formState, setFormState] = useState<any>({});
  const [fuse, setFuse] = useState<Fuse<any>>();
  const [focusedResult, setFocusedResult] = useState<number>(0);

  useEffect(() => {
    import('./municipalitiesForSearch.json').then(({ default: places }) => {
      setFuse(
        new Fuse(places, {
          keys: ['nameUnique', 'zipCodes'],
          includeScore: true,
          threshold: 0.2,
        })
      );
    });
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      if (query !== selectedPlace.name) {
        setSuggestionsActive(true);
        setSelectedPlace(initPlace);
        if (onPlaceSelect) {
          onPlaceSelect();
        }
      }

      if (fuse) {
        // We need to split the query string into zip code
        // and municipality name, so the user can search
        // for something like 99955 Bad Tennstedt
        let digits: RegExpMatchArray | null | string = query.match(/\d+/);
        digits = digits ? digits[0] : '';
        const name = query.replace(/\d+/g, '').trim();

        let searchProps;
        // If both zip code and name were inside the query string
        // we should search the data for name AND zip code
        if (digits !== '' && name !== '') {
          searchProps = {
            $and: [{ nameUnique: name }, { zipCodes: digits }],
          };
        } else if (digits !== '') {
          searchProps = digits;
        } else if (name !== '') {
          searchProps = name;
        } else {
          searchProps = '';
        }

        const fuseResults = fuse.search(searchProps);
        const results = fuseResults
          .map(x => ({ ...x.item, score: x.score }))
          .slice(0, 15);

        // Specific sort if searched for zip codes
        if (digits !== '') {
          // If a result with a correct match was found show that result
          // as first item and sort the rest by population
          results.sort((a, b) => {
            if (a.score < 0.001) {
              return -1;
            }

            if (b.score < 0.001) {
              return 1;
            }

            return b.population - a.population;
          });
        }

        // Sort by population if searched for name
        if (digits === '') {
          results.sort((a, b) => b.population - a.population);
        }

        if (name !== '') {
          results.sort((a, b) => {
            const lowercaseName = name.toLowerCase();
            // If result has name as first word (therefore the ${name}+space ) or equals name,
            // we want to prioritize it, e.g. Halle (Saale) or Halle.
            // If a and b match the condition we sort by population
            const aHasNameAsFirstWord =
              a.nameUnique.toLowerCase().startsWith(`${lowercaseName} `) ||
              a.nameUnique.toLowerCase().startsWith(`${lowercaseName},`) ||
              a.nameUnique.toLowerCase() === lowercaseName;
            const bHasNameAsFirstWord =
              b.nameUnique.toLowerCase().startsWith(`${lowercaseName} `) ||
              b.nameUnique.toLowerCase().startsWith(`${lowercaseName},`) ||
              b.nameUnique.toLowerCase() === lowercaseName;

            if (aHasNameAsFirstWord && bHasNameAsFirstWord) {
              return b.population - a.population;
            }

            if (aHasNameAsFirstWord) {
              return -1;
            }

            if (bHasNameAsFirstWord) {
              return 1;
            }

            // Next in prioritization: if result starts with query
            if (
              a.nameUnique.toLowerCase().startsWith(lowercaseName) &&
              b.nameUnique.toLowerCase().startsWith(lowercaseName)
            ) {
              return b.population - a.population;
            }

            if (a.nameUnique.toLowerCase().startsWith(lowercaseName)) {
              return -1;
            }

            if (b.nameUnique.toLowerCase().startsWith(lowercaseName)) {
              return 1;
            }

            // Next in prioritization: if result includes the query
            if (
              a.nameUnique.toLowerCase().includes(lowercaseName) &&
              b.nameUnique.toLowerCase().includes(lowercaseName)
            ) {
              return b.population - a.population;
            }

            if (a.nameUnique.toLowerCase().includes(lowercaseName)) {
              return -1;
            }

            if (b.nameUnique.toLowerCase().includes(lowercaseName)) {
              return 1;
            }

            return b.population - a.population;
          });
        }

        setResults(results);
      }
    } else {
      setResults([]);
    }
    // eslint-disable-next-line
  }, [query, fuse]);

  const validate = () => {
    let slug;
    if (selectedPlace.ags) {
      slug = `/orte/${selectedPlace.slug}`;
      return { status: 'success', slug };
    }
    if (results.length > 0 && results[0].score < 0.001) {
      slug = `/orte/${results[0].slug}`;
      return { status: 'success', slug };
    }
    const touched = true;
    const error = 'Bitte wähle eine Stadt aus';
    setFormState({ error, touched });
    return { status: 'failed' };
  };

  const handleSuggestionClick = (suggestion: MunicipalityWithScore) => {
    if (suggestion) {
      setQuery(suggestion.name);
      setSelectedPlace(suggestion);

      // If callback was passed let container component
      // know that the selected place changed
      if (onPlaceSelect) {
        onPlaceSelect(suggestion);
      }
      setSuggestionsActive(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);
    const touched = false;
    const error = '';
    setFormState({ error, touched });
  };

  const handleEnterKey = (e: KeyboardEvent) => {
    // Emulate click when enter is pressed
    if (e.key === 'Enter') {
      handleSuggestionClick(results[0]);
    }

    // Focus into suggestions when pressing arrow down
    if (e.key === 'ArrowDown' || e.which === 40) {
      setFocusedResult(0);
    }
  };

  const handleArrowListNavigation = (e: any) => {
    const isTab = e.key === 'Tab' || e.which === 9;

    const upBehavior =
      e.key === 'ArrowUp' || e.which === 38 || (isTab && e.shiftKey);
    const downBehavior =
      e.key === 'ArrowDown' || e.which === 40 || (isTab && !e.shiftKey);

    if (downBehavior) {
      // At the end of a list jump back to the beginning
      // and vice versa (but only for arrow keys).
      // If at the end and tab is pressed we want default behaviour
      if (focusedResult < results.length - 1 && focusedResult !== null) {
        setFocusedResult(prev => prev + 1);
        e.preventDefault();
      } else if (!isTab) {
        setFocusedResult(0);
        e.preventDefault();
      }
    } else if (upBehavior) {
      if (focusedResult > 0 && focusedResult < results.length) {
        setFocusedResult(prev => prev - 1);
        e.preventDefault();
      } else if (!isTab) {
        setFocusedResult(results.length - 1);
        e.preventDefault();
      }
    }
  };

  const handleBlur = (e: any) => {
    const isAutoCompleteTarget =
      e.relatedTarget &&
      [...e.relatedTarget.classList].join('').includes('suggestionsItem');

    const isAutoCompleteContainerTarget =
      e.relatedTarget &&
      [...e.relatedTarget.classList].join('').includes('suggestions') &&
      ![...e.relatedTarget.classList].join('').includes('suggestionsItem');

    if (!isAutoCompleteTarget && !isAutoCompleteContainerTarget) {
      setTimeout(() => {
        setSuggestionsActive(false);
        setFocusedResult(0);

        // If search places input is inside form,
        // we want to choose first element of suggestions as place
        if (!selectedPlace.ags && isInsideForm) {
          if (results.length > 0 && results[0].score < 0.001) {
            // Should have same behaviour as click on suggestion
            handleSuggestionClick(results[0]);
          }
        }
        if (validateOnBlur) {
          validate();
        }
      }, 300);
    }

    if (isAutoCompleteContainerTarget) {
      setFocusedResult(0);
    }
  };

  return (
    <>
      {label && <label>{label}</label>}
      <div className={s.container}>
        {searchTitle && <h2 className={s.searchTitle}>{searchTitle}</h2>}
        <div className={s.inputContainer}>
          <TextInput
            size={inputSize}
            placeholder={placeholder}
            autoComplete="off"
            label="Stadt"
            value={query}
            onChange={handleChange as any}
            onKeyDown={handleEnterKey as any}
            onBlur={handleBlur as any}
            className={cN(
              s.searchBar,
              { [s.isNotInsideForm]: !isInsideForm },
              { [s.fullWidthInput]: fullWidthInput }
            )}
          />

          <AutoCompleteList
            query={query}
            results={results}
            focusedResult={focusedResult}
            suggestionsActive={suggestionsActive}
            handleSuggestionClick={handleSuggestionClick}
            handleArrowListNavigation={handleArrowListNavigation}
            handleBlur={handleBlur}
          />
          <LabelInputErrorWrapper meta={formState} />
        </div>
        {showButton && (
          <Button
            id="linkButton"
            size={buttonSize}
            className={cN(
              { [s.sideButton]: !profileButtonStyle },
              { [s.profileSideButton]: profileButtonStyle }
            )}
            onClick={event => handleButtonClick({ event, validate })}
          >
            {buttonLabel}
          </Button>
        )}
      </div>
    </>
  );
};

type AutoCompleteListProps = {
  query: string;
  results: MunicipalityWithScore[];
  focusedResult: number;
  suggestionsActive: boolean;
  handleSuggestionClick: (x: MunicipalityWithScore) => void;
  handleBlur: (e: any) => void;
  handleArrowListNavigation: any;
};

export function AutoCompleteList({
  query,
  results,
  focusedResult,
  suggestionsActive,
  handleSuggestionClick,
  handleBlur,
  handleArrowListNavigation,
}: AutoCompleteListProps) {
  const resultsRef = useRef<any>([]);

  useEffect(() => {
    resultsRef.current = resultsRef.current.slice(0, results.length);
  }, [results]);

  useLayoutEffect(() => {
    if (focusedResult !== null && focusedResult < resultsRef.current.length) {
      resultsRef.current[focusedResult].focus();
    }
  }, [focusedResult, resultsRef]);

  return (
    <div
      className={cN(s.suggestions, { [s.active]: suggestionsActive })}
      onBlur={handleBlur}
      role="listbox"
    >
      {results.length === 0 && query.length > 1 && (
        <div className={s.noSuggestionsItem}>Keine Ergebnisse</div>
      )}

      {results.length > 0 &&
        query.length > 1 &&
        results.map((x, i) => {
          return (
            <div
              key={x.ags}
              id={`autocomplete-${x.name.toLowerCase()}`}
              className={s.suggestionsItem}
              role="button"
              aria-pressed="false"
              tabIndex={0}
              ref={el => (resultsRef.current[i] = el)}
              onClick={e => handleSuggestionClick(x)}
              onKeyDown={e => {
                // Emulate click when enter or space are pressed
                if (e.key === 'Enter' || e.keyCode === 32) {
                  e.preventDefault();
                  handleSuggestionClick(x);
                }
                handleArrowListNavigation(e);
              }}
            >
              {x.nameUnique},{' '}
              {x.zipCodes && (
                <>
                  {x.zipCodes.length === 1
                    ? `${x.zipCodes[0]}`
                    : `${x.zipCodes[0]} - ${x.zipCodes[x.zipCodes.length - 1]}`}
                </>
              )}
            </div>
          );
        })}
    </div>
  );
}
