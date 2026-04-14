import { carbonara } from "@/content/recetas/carbonara";
import { cacioEPepe } from "@/content/recetas/cacio-e-pepe";
import { pestoGenovese } from "@/content/recetas/pesto-genovese";
import { salsaPomodoro } from "@/content/recetas/salsa-pomodoro";
import { tiramisu } from "@/content/recetas/tiramisu";
import { pizzaMargherita } from "@/content/recetas/pizza-margherita";
import { trofieAlPesto } from "@/content/recetas/trofie-al-pesto";
import { pappardelleAlRagu } from "@/content/recetas/pappardelle-al-ragu";
import { linguineAlLimone } from "@/content/recetas/linguine-al-limone";
import { tagliatelleAlTartufo } from "@/content/recetas/tagliatelle-al-tartufo";
import { risottoAllaMilanese } from "@/content/recetas/risotto-alla-milanese";
import { caprese } from "@/content/recetas/caprese";
import { lasagna } from "@/content/recetas/lasagna";
import { aceiteOlivaExtraVirgen } from "@/content/guias/aceite-de-oliva-extra-virgen";
import { dopIgpDocg } from "@/content/guias/dop-igp-docg";
import { pastaSecaVsFresca } from "@/content/guias/pasta-seca-vs-fresca";
import { proseccoDocDocg } from "@/content/guias/prosecco-doc-docg";
import type { Guide, Recipe } from "./types";

export const recipes: Recipe[] = [
  salsaPomodoro,
  pestoGenovese,
  carbonara,
  cacioEPepe,
  pizzaMargherita,
  pappardelleAlRagu,
  lasagna,
  trofieAlPesto,
  linguineAlLimone,
  tagliatelleAlTartufo,
  risottoAllaMilanese,
  caprese,
  tiramisu,
];

export const guides: Guide[] = [
  aceiteOlivaExtraVirgen,
  dopIgpDocg,
  pastaSecaVsFresca,
  proseccoDocDocg,
];

export function getRecipe(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
