# UUAF

Universally Unique Animal Formulas

> I wonder how things works in different universes...

## Installation and basic usage

```sh
npm install uuaf --save
```

```typescript
import { uuaf } from "uuaf";

console.log(uuaf());
// Formula 7e4486e0: chicken named Sarah + ram named Stephanie = macaw named Alexandria. Applicable only in universe 0d7f4796cfe7
```

## Main goals

<dl>
  <dt>Glanceability</dt>
  <dd>UUAF main goal is to improve UUID *glanceability* - it is much easier to mentally parse and get at least some information out of UUAF in comparison to UUID.</dd>
  <dt>Partial memorability</dt>
  <dd>UUAF are not meant to be fully memorable - instead they are constructed in a way that it is easy to remember few parts that could help with narrowing down the candidates during lookup. </dd>
   <dt>UUID equivalence</dt>
  <dd>UUAF provides one-to-one mapping to UUID</dd>
</dl>

## Features

- based on [uuid npm library](https://www.npmjs.com/package/uuid), but it can work with plain strings as well
- functions for direct UUAF generation supporting different UUID versions underneath
- functions for translating from UUID to UUAF and vice versa
- UUAF comes in two basic forms - short and long
- typescript support

## Examples

- Formula 7e4486e0: chicken named Sarah + ram named Stephanie = macaw named Alexandria. Applicable only in universe 0d7f4796cfe7
- 7e4486e0-chicken-Sarah-ram-Stephanie-macaw-Alexandria-0d7f4796cfe7
- 7e4486e0-d6e0-11ea-8108-0d7f4796cfe7

- Formula 2692d4db: eel named Kaitlyn + wasp named Victor = badger named Tiffany. Applicable only in universe 74fc56355e46
- 2692d4db-eel-Kaitlyn-wasp-Victor-badger-Tiffany-74fc56355e46
- 2692d4db-0889-39f9-90f0-74fc56355e46

- Formula 3a7c1b89: ferret named Raymond + kite named Jesus = mantis named Miguel. Applicable only in universe 621fb5d309d2
- 3a7c1b89-ferret-Raymond-kite-Jesus-mantis-Miguel-621fb5d309d2
- 3a7c1b89-99d3-4177-a1bd-621fb5d309d2

- Formula 952383ad: caribou named Corey + vole named Molly = bonobo named Taylor. Applicable only in universe a00af9c2a3c3
- 952383ad-caribou-Corey-vole-Molly-bonobo-Taylor-a00af9c2a3c3
- 952383ad-d340-50bf-b3ee-a00af9c2a3c3
