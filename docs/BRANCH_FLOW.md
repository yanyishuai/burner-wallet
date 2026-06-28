# Burner Wallet — Git Branch Flow

This document defines the branch strategy for `austintgriffith/burner-wallet`
and is intended for new contributors and bounty workers.

> Closes #208.

## 1. Goals

* Keep `master` releasable at all times.
* Make ongoing work easy to review and rollback.
* Provide a clear path for new contributors to land changes safely.

## 2. Branch tiers

| Branch      | Purpose                                                | Protected |
|-------------|--------------------------------------------------------|-----------|
| `master`    | Always releasable. Tagged for releases.                | Yes       |
| `staging`   | Integration branch for the next release candidate.    | Yes       |
| `develop`   | Day-to-day development; merged into `staging` weekly.  | Yes       |
| `feature/*` | Short-lived feature branches. Max 1 week old.          | No        |
| `fix/*`     | Short-lived bugfix branches. Max 1 week old.           | No        |
| `bounty/*`  | Branches tied to a specific bounty issue (e.g. `#212`).| No        |

The tier names are inspired by the standard Git Flow but stripped down to fit
this single-package repository.

## 3. Lifetime and naming

* Feature branches are created from `develop` and merged back into `develop`
  via a pull request.
* Bounty branches follow the convention `bounty/issue-<NUMBER>-<slug>`
  (e.g. `bounty/issue-212-special-urls`).
* A branch that has been open for more than 14 days without a commit is
  considered stale — please rebase or close it.

## 4. Pull request flow

```
feature/* --+
             |--> develop --+--> staging --+--> master
fix/*     --+               |              |
bounty/*  --+               |              |
                            |              |
                            +-> hotfix/* --+
```

* PRs into `develop` require one review and a green CI run.
* PRs from `develop` into `staging` require one review and a green CI run.
* PRs from `staging` into `master` require two reviews and a green CI run.

## 5. Releases

* `master` is tagged on every release. Tags follow `vYYYY.MM.DD` or a
  semver `vMAJOR.MINOR.PATCH` when the changes are user-visible.
* Hotfixes to a published release go to a `hotfix/*` branch cut from the
  release tag, then merged into both `master` and `develop`.

## 6. CI

* `.github/workflows/ci.yml` runs on every push and PR targeting `master` or
  `main`.
* A green CI run is mandatory before merging.

## 7. Quick start for new contributors

```bash
git clone git@github.com:austintgriffith/burner-wallet.git
cd burner-wallet
git checkout develop
git checkout -b feature/your-feature
# ... work, commit ...
git push origin feature/your-feature
# open a PR targeting develop
```

## 8. Bounty workers

When working on a bounty:

1. Create a `bounty/issue-<NUMBER>-<slug>` branch from `develop`.
2. Reference the issue number in commits and the PR title.
3. Open a PR targeting `develop` so it is reviewed alongside other bounty
   work. The maintainers will cut a release that bundles accepted bounties
   into `staging` and then `master`.

## 9. Future work

* Add branch protection rules in the GitHub settings so direct pushes to
  `master`, `staging`, and `develop` are blocked.
* Automate stale-branch cleanup (close branches inactive for 30+ days).
* Add a CODEOWNERS file mapping top-level directories to reviewers.
