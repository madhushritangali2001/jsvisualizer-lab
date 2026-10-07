<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the requested learning experience on a single index route with anchor navigation, because the brief explicitly requires smooth scrolling between activities.
- Store shared JavaScript facts and score rules in browser-safe data modules, and isolate activities into reusable React components, so educational rules stay consistent.
- Run student code only inside a disposable worker hosted by an opaque-origin, network-blocked sandbox iframe, so experiments cannot access app storage or freeze the interface.
- Keep topic progress in React state for the current lab session, because this browser-only experience has no accounts or persistent student records.
- Capture console output separately from the final declared value in the sandbox worker, so learners can inspect both printed output and data type without running student code on the app thread.
