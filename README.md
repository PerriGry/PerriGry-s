# PerriGry-s

## 🌱 Flujo de trabajo con ramas

### 1. Cambiar a la rama `develop`
```bash
git checkout develop
```
### 2. Creación de Ramas 'Features' en La Rama 'Develop'
 - -b → crea una nueva rama
 - new-feature → nombre de la nueva rama
```bash
git checkout -b new-feature
```
### 3. Cómo subir la rama a GitHub 
```bash
git push -u origin new-feature
```
 - Solo Necesita Hacerlo Por Primera vez, luego podrás usar (`git push`)

### 4. Mezclar Cambios con la rama Develop
 - Dirigete a la rama Develop (`git checkout develop`)
 - Actualiza la rama Develop (`git pull origin develop`)
 - Mezcla la rama feature (`git merge new-feature`)
 - Arreglar Conflictos (Sí hay)
 - Subir la Rama Develop Actualizada (`git push origin develop`)
