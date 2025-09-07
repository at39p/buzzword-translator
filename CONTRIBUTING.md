# Contributing to Corporate Buzzword Translator

Thanks for helping us decode corporate speak! 🎯 We welcome contributions to expand our buzzword database and improve translations.

## Adding New Buzzwords

### Quick Steps
1. Fork the repository
2. Edit `buzzwords.js` to add your buzzword
3. Test it works by opening `index.html` in your browser
4. Submit a pull request

### Buzzword Format
Each buzzword entry should follow this structure:

```javascript
{
  phrase: "your buzzword here",
  translation: "plain English explanation",
  keywords: ["searchable", "terms", "for", "finding", "it"],
  category: "appropriate_category",
  alternatives: ["other ways", "to say it"],
  context: "When and why this phrase is used"
}
```

### Guidelines
- **Translation**: Keep it simple and conversational - imagine explaining it to a friend
- **Keywords**: Include variations people might search for
- **Categories**: Use existing ones when possible: `strategy`, `communication`, `productivity`, `analysis`, etc.
- **Context**: Help people understand when they'd encounter this phrase
- **Alphabetical**: Add new entries in alphabetical order within their section

### Optional: Multiple Meanings
If your buzzword has different meanings in different contexts:

```javascript
{
  phrase: "leverage",
  translation: "use or take advantage of",
  // ... other fields ...
  multipleMeanings: [
    {
      translation: "borrow money to invest",
      context: "In finance, using borrowed capital to increase returns"
    }
  ]
}
```

## Editing Existing Buzzwords

Found a translation that could be clearer? Go for it! We want the most helpful, accurate explanations.

## Testing Your Changes

1. Open `index.html` in your browser
2. Search for your new/edited buzzword
3. Make sure it appears in results and looks good
4. Try related keywords to ensure discoverability

## Pull Request Tips

- **Title**: "Add [buzzword]" or "Improve [buzzword] translation"
- **Description**: Brief note about what you added/changed and why
- **One buzzword per PR**: Makes review easier

## Questions?

Open an issue if you're unsure about a buzzword's translation or category. We're happy to discuss!

---

*Remember: The goal is helping people understand corporate jargon, not making fun of it. Keep translations helpful and professional.*