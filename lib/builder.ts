import { builder } from '@builder.io/react';

// Initialize Builder.io with your API key
// Get your API key from: https://builder.io/account/space
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

export { builder };
