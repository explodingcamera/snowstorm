---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

1. Install Snowstorm and the Snowstorm CLI
  ```bash
  $ yarn install @snowstorm/core @snowstorm/cli
  ```


2. Add the Snowstorm CLI commands to your `package.json` scripts section
  ```json
  ...
    "scripts": {
      "dev": "snowstorm dev",
      "start": "snowstorm start"
    },
  ...
  ```

3. Create your first Page<br/>

  `pages/index.tsx`
  ```tsx
  import React from 'react';

  export const Index = () => {
    return <div>
      Hello World!
    </div>
  }
  ```
