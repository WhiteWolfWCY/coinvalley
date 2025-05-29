import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

interface CustomRenderOptions extends RenderOptions {
}

function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: ({ children }) => {
        return React.createElement(React.Fragment, null, children);
      },
      ...options,
    }),
  };
}

export * from '@testing-library/react';

export { customRender as render };

describe('test-utils', () => {
  it('should exist', () => {
    expect(customRender).toBeDefined();
  });
}); 