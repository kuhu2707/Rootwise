# Rootwise frontend POC

A React prototype for comparing two GVC output datasets. The UI uses mock data and runs entirely in the browser while the hackathon backend is being planned.

## Run locally

```bash
yarn install
yarn dev
```

Create a production build with `yarn build`.

## POC flow

Choose GVC Analyst or Cost Analyst, configure two datasets and a user-defined threshold, step through the four agent stages, review the flagged Root Plant / SKU combinations, and open a row for variance detail. Both angles use the same dataset comparison and flagged rows. The GVC angle shows diagnostic commentary; the Cost Analyst angle shows management commentary.

## Structure

```text
src/
  app/                 Shared application state and shell
  components/          Navigation, pipeline, table, and common UI
  data/                Screen labels and mock comparison results
  features/workspace/  Entry, setup, agent run, results, and variance detail pages
    varianceDetail.css  Variance detail page layout and responsive styles
  styles/              Shared design tokens and workspace styles
```
