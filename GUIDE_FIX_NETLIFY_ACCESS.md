# Guide de Résolution - Erreur d'Accès Netlify au Dépôt GitHub

## ❌ Erreur : "Failed to prepare repo"

Cette erreur signifie que Netlify ne peut pas accéder à votre dépôt GitHub avant même de commencer le build.

## ✅ Solutions étape par étape

### 1. Vérifier l'accessibilité du dépôt GitHub

Testez si le dépôt est accessible :

```bash
git clone https://github.com/lolopounie/formulaireCite.git
```

Si cela échoue, vérifiez que :
- Le dépôt existe bien sur GitHub
- Le dépôt n'est pas privé sans accès Netlify
- L'URL est correcte

### 2. Reconnecter Netlify à GitHub (Solution la plus courante)

#### Étape A : Dans Netlify

1. Allez sur [Netlify Dashboard](https://app.netlify.com)
2. Sélectionnez votre site
3. Allez dans **Site settings** → **Build & deploy** → **Continuous Deployment**
4. Cliquez sur **Repository** → **Edit** (ou **Disconnect** puis **Connect to Git provider**)
5. Sélectionnez **GitHub** et reconnectez le dépôt `lolopounie/formulaireCite`
6. Autorisez Netlify à accéder au dépôt si demandé

#### Étape B : Vérifier les permissions GitHub

1. Allez sur [GitHub](https://github.com)
2. Cliquez sur votre avatar → **Settings**
3. Allez dans **Applications** → **Installed GitHub Apps**
4. Trouvez **Netlify** dans la liste
5. Vérifiez que Netlify a accès à :
   - ✅ Tous les dépôts, OU
   - ✅ Spécifiquement `formulaireCite`
6. Si Netlify n'est pas listé ou n'a pas accès, réinstallez l'app :
   - Dans Netlify, déconnectez le dépôt
   - Reconnectez-le et autorisez l'accès complet

### 3. Vérifier la branche à déployer

1. Dans Netlify : **Build & deploy** → **Continuous Deployment** → **Branch to deploy**
2. Vérifiez que la branche existe dans votre dépôt :
   - `main` ou `master` (selon votre dépôt)
3. Pour vérifier vos branches locales :
   ```bash
   git branch -a
   ```
4. Si la branche configurée n'existe pas :
   - Changez la branche dans Netlify vers une branche existante
   - OU poussez la branche sur GitHub :
     ```bash
     git push -u origin main
     # ou
     git push -u origin master
     ```

### 4. Vérifier que le code est bien poussé sur GitHub

Assurez-vous que votre code local est synchronisé :

```bash
# Vérifier l'état
git status

# Si vous avez des changements non commités
git add .
git commit -m "Fix Netlify configuration"

# Pousser vers GitHub
git push origin main
# ou
git push origin master
```

### 5. Vérifier les sous-modules Git (si applicable)

Si votre dépôt utilise des sous-modules :

```bash
# Tester localement
git clone --recursive https://github.com/lolopounie/formulaireCite.git
git submodule update --init --recursive
```

Si les sous-modules sont privés, Netlify ne pourra pas y accéder. Vous devrez :
- Rendre les sous-modules publics, OU
- Donner à Netlify l'accès aux dépôts des sous-modules

### 6. Solution alternative : Déploiement manuel

Si le problème persiste, vous pouvez déployer manuellement :

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
npm run build
netlify deploy --prod --dir=dist
```

## 🔍 Diagnostic avancé

### Obtenir plus de détails sur l'erreur

1. Dans Netlify, allez sur la page du déploiement échoué
2. Cliquez sur **Show deploy log**
3. Développez les logs avancés/verbose
4. Cherchez les lignes autour de "Failed to prepare repo"
5. Les messages d'erreur spécifiques vous indiqueront :
   - Problème de permissions
   - Branche introuvable
   - Dépôt inaccessible
   - Problème de sous-module

## ✅ Checklist de vérification

- [ ] Le dépôt GitHub existe et est accessible
- [ ] Netlify est connecté au dépôt dans les paramètres
- [ ] Netlify a les permissions GitHub nécessaires
- [ ] La branche configurée dans Netlify existe sur GitHub
- [ ] Le code est bien poussé sur GitHub
- [ ] Pas de sous-modules privés non accessibles
- [ ] Redéploiement déclenché après reconnexion

## 🆘 Si le problème persiste

1. Copiez les logs complets de Netlify (lignes autour de "Failed to prepare repo")
2. Vérifiez les permissions GitHub de Netlify
3. Essayez de déconnecter et reconnecter complètement le dépôt
4. Contactez le support Netlify si nécessaire

